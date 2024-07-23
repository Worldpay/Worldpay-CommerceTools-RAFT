# Worldpay RAFT - commercetools Connector - Deployment Guide

This guide details how to deploy the connector within a commercetools (production) environment.

Deployment involves several steps:

1. Deploy the commercetools model extensions, adding the custom fields and states to the commercetools project
    1. Customer extension: adds the cardOnFileTokens property
    1. Payment extension: adds the custom fields for RAFT
    1. Payment interaction extension: adds the RAFT interface interaction
    1. Payment states: adds the custom payment states that support progressing the payment
1. Deploy the payment extension to provide an endpoint for events from the commercetools payment to be processed
1. Register the extension as the endpoint for events in the commercetools project

### Overview

Below you find a diagram of the connector, for more details on the connector, see the [Technical Documentation](./TechnicalDocumentation.md)

![Image: architecture diagram](architecture.drawio.svg)

## Installation

To install the connector, follow these steps:

1. Decide how to deploy the connector in your infrastructure landscape. Options are:
    1. As a commercetools connect connector (included in this repository)
    2. As an AWS lambda (in the apps/extension folder)
    3. As a Docker image (see the docker folder for details)
    4. Other options, for instance Microsoft Azure function, Google Cloud Function are feasable too
2. Depending on the choice above, you may have to develop some code - primarily the 'Other options' is not included, but also an AWS Lambda or Docker deployment may require additional code to integrate into your Infrastructure as Code constructs.
3. In case of commercetools connect, this step can be omitted, but in all other cases:
    1. Deploy the commercetools model extensions for payment, transaction and/or customer.
    2. Configure the commercetools project to invoke the RAFT connector for Payment Create/Update API extensions.

The connector code is provided in the package `@gradientedge/worldpay-raft-connector`, and the deployment just forms a thin wrapper around it. It also picks up deployment-specific configuration parameters and passes them into the connector in the form of an object. Configuration in AWS lambda for instance, could read the configuration from AWS Secrets, builds a TypeScript configuration object with that, and start the connector as lambda passing the configuration.
When deploying as a commercetools connect application or a Docker image, the `@gradientedge/worldpay-raft-connector` is wrapped in an express application, which is configured via environment variables, and receives the payment update via a http(s) request. The environment variables need to be converted into a configuration object and passed to the connector. The https request will be unpacked, and from that point onwards, the code is shared with the lambda version.
We recommend using a https connection with [authentication](https://docs.commercetools.com/api/projects/api-extensions#httpdestinationauthentication) enabled, so the endpoint cannot be accessed by everyone. Also, if possible, protect your endpoint with a firewall and limit the sources from which it accepts requests (for instance, if you run commercetools in GCP US, restrict the access to IP addresses for GCP US).

#### Model extensions and states

There are a number of files included in the connector for extending the data model(s) from commercetools and the payment states:
See folder `resources/commercetools`. You can create the model extensions in your commercetools project by invoking the [Custom Types](https://docs.commercetools.com/tutorial$s/custom-types#creating-a-custom-type) endpoint of commercetools. Use your own IaC (infrastructure as code) framework for automated deployment (i.e. Terraform with the [commercetools provider](https://registry.terraform.io/providers/labd/commercetools/latest/docs)), or the [commercetools postman project collection](https://docs.commercetools.com/sdk/postman) to deploy the model extensions to your commercetools project.

| File name                   | Description                                      |
|-----------------------------|--------------------------------------------------|
| payment-states.json         | The payment states to add. Run each entry in the `states` array in a separate `createState` call to commercetools |
| customer-types.json         | Model for the customer's card--on-file object(s). This is modelled as a list of strings, where each string holds a JSON object with the credit card store on-file for the customer. Using a string per card allows removal of a single card from the merchant center. |
| payment-types.json          | The payment extensions, with the custom fields for the WorldPay RAFT customizations. |

Concerning the payment states:

Out of the box, the connector supports the following states, which may not be sufficient, depending on your requirements:

| State | Description                                                          |
|-------|----------------------------------------------------------------------|
| Open  | An authorization was successful, but no completion yet |
| Paid  | There was a successful completion on this payment |
| Failed | The authorization or completion on this payment failed |
| Refunded | The full amount originally completed on this payment was refunded to the customer |
| Cancelled | The full amount originally authorized on this payment was cancelled |

States which are deliberately omitted are the states that would be a result of partial transaction - as they are too dependent on your specific requirements.
For example, what would be the state of a payment with a successful authorization of \$100 and a successful cancellation of \$10? Is it Paid, Cancelled, Partially Paid, Partially Cancelled? And what if that cancellation fails? Similarly, an additional refund of \$50 on the above payment?
If you add or remove states, please modify the connector source code to update the payment object accordingly.

### Configuration

When starting the connector, configuration needs to be passed in to control how the connector behaves. The configuration will be validated at start-up time, to check if all required parameters for the application are in place. Missing configuration will cause the connector to fail.

The configuration object has the following properties:

| Property name | Type | Description |
|---------------|------|-------------|
| worldpayRaft.URL | string, optional | The URL of the server used for RAFT communication, defaulting to 'https://ws-cert.vantiv.com' |
| worldpayRaft.path | string, optional | The path on the RAFT server, defaulting to '/merchant/servicing/apitransactions/NativeRaftApi/v1' if unavailable in the configuration. The path is concatenated to the URL |
| worldpayRaft.license | string | The RAFT license number that will be used in the request header to authenticate with the RAFT service |
| worldpayRaft.timeoutMs | number | The timeout of the call to the WorldPay RAFT service by the connector. Note that commercetools also has a timeout for invocation of the connector itself. In case the latter exceeds the configuration, commercetools will abort the transaction before the connector does, and the result could be that the RAFT action was executed, but the results were never persisted in commercetools. Please define a value in the configuration that is below the commercetools timeout to avoid unpredictable failures. |
| worldpayRaft.maxRetries | number | The maximum number of attempts to re-send a timed-out message before reverting the message |
| worldpayRaft.reverseMaxRetries | number | The maximum number of attempts to re-send a reversal message if that times out |

The license will be sent in the header of each request the connector sends to Worldpay.

For the timeout-handler, additional properties to connect to commercetools are required:

| Property name | Type | Description |
|---------------|------|-------------|
| commercetools.clientId | string | A commercetools clientId to log on to commercetools |
| commercetools.clientSecret | string | A commercetools clientSecret, required authorization for `manage:payments` |
| commercetools.projectKey | string | The commercetools projectKey |
| commercetools.region | string | The commercetools region |
| commercetools.timeoutMs | number | The number of milliseconds before a commercetools connection times out |

The following information is included in each individual message sent to RAFT and can be used for multiple accounts.

| Property name | Type | Description |
|---------------|------|-------------|
|  MerchantID | string, required | The merchantID which identifies the merchant with the RAFT service |
|  STPBankID | string, required | The BankID used in each request to the RAFT service, identifying the merchant's bank |
|  STPTerminalID | string, required | The TerminalID sent to RAFT in each communication, identifying the merchant |

In case you need different Vantiv licenses in a single environment you can either deploy multiple instances of the connector and filter the events from commercetools to reach one or the other instance, or modify the connector code to support multiple licenses in a single instance.

#### Docker configuration

To configure the connector inside docker:

**Option 1**: Create a .env file on the root of the project, holding key/value pairs with secrets. For example:
```shell
CTP_PROJECT_KEY=<your commercetools project key>
CTP_CLIENT_ID=<commercetools client id>
...
RAFT_LICENCE=<RAFT license>
```

Then, when building the Docker image, this environment file is included, and the application will pick up the values upon start.
From a security standpoint, this may not be the best option - though, as the credentials and secrets are integrated into the Docker image.
Therefore, we do not recommend this approach for production.

**Option 2**: Create the docker image without the credentials, and [pass in environment variables](https://docs.docker.com/engine/reference/run/#env-environment-variables) when starting up the Docker container.

#### Front-end configuration

The following configuration is required for the front-end. As the front-end is not included in the connector, we can only provide you what information needs to be used - the exact way to supply this information to your application depends on your choice of technology.

| Artefact | Used in | Description | More information |
|------|--------|-----------|-----------|
| paypageId | eProtect form | This identifier needs to be passed when starting the eProtect form |  User Guide |
| merchantId | eProtect form | The MID that defines the Worldpay RAFT account for the payment | User Guide |
| Apple Certificate | Apple Pay | The integration requires two certificates. The merchant certificate in arranged by you via the [standard Apple Pay integration process](https://developer.apple.com/documentation/apple_pay_on_the_web/configuring_your_environment). The payment requires a 2nd certificate, and that will be arranged via Worldpay. Make sure the 2nd certificate aligns with the merchant id.

Both Apple Pay certificates should be kept safe and must never be shared with customers. Store them in a place that is accessible by the application serving the front-end.
The files have to be saved in ASCII format:

``` shell
openssl x509 -inform der -in merchant_id.cer -out certificate.pem
```

An example of how to integrate eProtect with Apple Pay:

``` TypeScript

export type ApplePayFormProps = {
  handleValidateMerchant: Function
  handlePayWithRaft: Function
  paymentError: string
  totalPrice: any
  paypageId: string
  orderId: string
  merchantId: string
}

export const ApplePayForm = (props: ApplePayFormProps) => {
  const { locale, countryCode } = useContext(SiteContext)
  const realAmount = priceToNumber(props.totalPrice)
  const formattedPrice = realAmount?.toFixed(2)

  const eProtectSuccessCallback = (onPayWithRaft: Function, applePaySession: any) => (response: any) => {
    if (response.timeout) {
      alert('We are experiencing technical difficulties.  Please try again or call us to complete your order')
    } else if (response.response === '870') {
      // check if we have an expDate on the response and if so call splitExpDate in order to split the date into the
      // component parts to send to onPayWithRaft
      if (response.expDate) {
        try {
          const { expiryMonth, expiryYear } = splitExpDate(response.expDate)
          onPayWithRaft({ lowValueToken: response.paypageRegistrationId, expiryMonth, expiryYear })
        } catch (e) {
          // We shouldn't hit this but if we do continue without the expiryMonth/expiryYear
          onPayWithRaft({ lowValueToken: response.paypageRegistrationId })
        }
      } else {
        onPayWithRaft({ lowValueToken: response.paypageRegistrationId })
      }
      applePaySession.completePayment(window.ApplePaySession.STATUS_SUCCESS)
    } else {
      // Handle Failure
      applePaySession.completePayment(window.ApplePaySession.STATUS_FAILURE)
      alert('We are experiencing technical difficulties.  Please try again or use an alternative payment method')
      applePaySession.abort()
    }
  }
  const details = {
    countryCode: countryCode || 'US',
    currencyCode: props.totalPrice.currencyCode,
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    total: {
      label: 'Demo (Card is not charged)',
      amount: formattedPrice,
    },
  }

  function eProtectErrorCallback(options: any) {
    console.log('eProtectErrorCallback', options)
  }

  function eProtectTimeoutCallback(options: any) {
    console.log('eProtectTimeoutCallback', options)
  }

  function sendApplePayTokenToEprotect(pkPaymentToken: any, handlePayWithRaft: any, applePaySession: any) {
    // Within the pkPaymentToken we are interested in the paymentData Object
    const applepayData = pkPaymentToken?.paymentData

    const eProtectRequest = {
      paypageId: props.paypageId,
      reportGroup: '*merchant1500',
      orderId: props.orderId,
      id: props.merchantId,
      url: 'https://request.eprotect.vantivprelive.com',
      applepay: applepayData,
    }
    if (window.eProtect) {
      new eProtect().sendToEprotect(
        eProtectRequest,
        {},
        eProtectSuccessCallback(handlePayWithRaft, applePaySession),
        eProtectErrorCallback,
        eProtectTimeoutCallback,
        15000
      )
      return false
    }
  }

  const handleInitializeApplePay = () => {
    let applePaySession: any
    if (window.ApplePaySession) {
      if (window.ApplePaySession.canMakePayments() && !applePaySession) {
        applePaySession = new ApplePaySession(3, details)

        applePaySession.onvalidatemerchant = async (paymentEvent: any) => {
          const merchantValidation = await props.handleValidateMerchant({ validationURL: paymentEvent.validationURL })
          applePaySession.completeMerchantValidation(merchantValidation?.validateMerchant?.merchantValidation)
        }

        applePaySession.onpaymentauthorized = (paymentEvent: any) => {
          // Once the payment is authorized, we receive a PKPaymentToken, we need a request to eProtect to convert it in a lowValue token
          sendApplePayTokenToEprotect(paymentEvent?.payment?.token, props.handlePayWithRaft, applePaySession)
        }
      }
      applePaySession.begin()
    }
  }

  return (
    <>
      <Script src="https://applepay.cdn-apple.com/jsapi/v1.1.0/apple-pay-sdk.js" strategy={'afterInteractive'} />
      <Script
        src="https://request.eprotect.vantivprelive.com/eProtect/eProtect-api3.js"
        strategy={'afterInteractive'}
      />
      <div className={styles.tenderTypeContainer}>
        <ApplePayButton
          buttonStyle={'black'}
          type={'buy'}
          locale={locale || 'en_US'}
          onClick={handleInitializeApplePay}
        />
      </div>
    </>
  )
}
```

> NB: never commit the private key into version control nor expose it via the browser, as it provides the security related to payments. Instead make it available in your cloud environment via a key vault or secret manager available from your cloud vendor. Access should be restricted to a known, limited group of people.


## Timeouts and retries

The extension is invoked by commercetools when the payment object is created or updated. The response to the invocation is expected by commercetools within a pre-defined timeout.
In case the extension exceeds the timeout, the payment update is reverted by commercetools, and an error is delivered to the calling application. However, the extension may have invoked RAFT, which will process the request and send a response. This response is lost, even if the extension receives it and passes the response back to the caller - commercetools stopped listening for it and will not update the payment with the returned actions. **This means no trace of the call remains visible in the data model of commercetools**. Only the browser console of your application, API logs or payment extension logs will show evidence of the call. There are a number of defenses against such a situation:

1. Configure the timeout that the extensions awaits the RAFT response, so the connector is back in control before commercetools times out the request.
    * Any actions built in the extension will be processed by commercetools, so at least a trace of the event is available in the payment object
    * RAFT may still have received the request, and can have processed it as well. A retry of the same request will be attempted, using the same apiTransactionID. This will cause RAFT to respond with the same payload, avoiding duplicate transactions.
2. Minimize the startup time of the extension, for instance by provisioning reserved instances in AWS. If the connector is deployed in Kubernetes, warm the docker instance before reporting it as ready to receive requests in Kubernetes, using the readiness probe.
3. Avoid doing work in the connector that can be done outside of it as much as possible (i.e. the API layer can load the cart / customer to build a message before invoking commercetools to update or create the payment)
4. Include metrics to measure the time the RAFT connector requires on requests, as well as the entire connector execution time. Use these to optimise the commercetools timeout and RAFT call timeouts. The differences between several deployment options vary greatly, as well as the variance across calls and under different load, so giving a general prediction of the precise settings is virtually impossible. We advise planning for testing early in the project, so you can hit the ground running when moving to production.

The timeout configured in the RAFT connector should be (at least) 0,5 seconds below the commercetools timeout. That ensures the connector gets back control and is able to construct a reply for commercetools.
In case of a RAFT timeout, a new transaction is added to the payment with status pending. A timeout handler that invokes the timeout-controller should be deployed in your infrastructure. When invoked, it queries commercetools for any payments with transactions in state `Pending`. If found, the standard action is to increment the retryCount custom field on the transaction.
Doing that causes an event to be fired to the connector, which detects the still populated `request` field, triggering a RAFT message with the exact same content. If a success or failure response is received this time, the transaction is updated. Another timeout will make the timeout handler pick up the message in the next run.

When the timeout handler finds a pending transaction that exceeds the maximum number of retries (from `maxRetries` in the configuration), it changes the existing `request` message into a message with the same content, but a different `AuthorizationType` - changed to `RV - Reversal`. Also, the `retryCount` property is changed to -1. This reversal is then picked up by the connector to revert the original message should that have been received and processed by RAFT.

The transaction's state will remain `Pending`, so the timeout handler will re-trigger the resend of the message, this time decreasing the `retryCount` value, until that reaches the value of `reverseMaxRetries`, at which point the transaction is marked as `Failure`.
When the connector does get a response for a reversal, it will mark the transaction as `Failure` even if the reversal succeeds if the original transaction was a non-reversal.

How and when to trigger the timeout handler is up to you. In a demo application we deployed, the handler is an AWS lambda, and we manually triggered it. However, in a more typical deployment, there is a scheduled invocation of the lambda - say once every 10 minutes.
That will cause any `Pending` transaction to be retried within 10 minutes. With a `maxRetries` set to 9, it means a timed-out transaction is retried for 90 minutes. A `reverseMaxRetries` setting of 144 the timeout-handler would then attempt to revert the transaction for 24 hours before giving up.  

In case a customer places an order and a timeout occurs, we advise to accept the order and display an order confirmation page to the customer. Then wait with further processing of the order until the CreditAuth is `Success` or `Failure` and deal with the outcome accordingly.

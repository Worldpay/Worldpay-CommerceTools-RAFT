# Worldpay RAFT Technical documentation

The Worldpay RAFT connector is a payment connector for commercetools. It communicates with Worldpay RAFT based on messages sent by commercetools and updates the payment information with the response it receives.

The connector supports the following APIs from RAFT:

* Credit API
* GiftCard API
* System API

Others are not supported (yet) but can easily be added:

* Account API
* ACH API
* APM API
* Batch Upload API
* Check API
* Debit API
* Key Change API
* Store
* Tokenization API

## Architecture

The connector uses the commercetools construct of an extension. An extension receives events (in this case a payment Create or Update event) with the changed object as payload and is able to modify the object with a number of actions to include in the creation/update. The object is either persisted with those extra actions, or rolled back (in case of exceptions or errors).
The execution of an extension is synchronous. This is different from subscriptions, where the update to an object is completed before the subscription receives the event. A subscription cannot influence the outcome of the action, whereas an extension can.

The connector is built using TypeScript, and can be deployed to cloud solutions (AWS, Azure, Google cloud), a Docker container or as a commercetools connect application. Inside the connector GitHub repository, you can find examples of AWS, Docker and the commercetools connector.

### Overview

Below you find a diagram of the connector

![architecture](architecture.drawio.svg)

The diagram depicts a number of elements that are *not* part of the connector:

* UI: The user interface application that displays information for the customer.
    * The UI optionally uses a JavaScript or IFrame component called eProtect, that supports encrypting credit card information into tokens. By doing so, it greatly reduces the PCI compliance exposure for you, the merchant.
* API: The API layer that the UI uses to translate the UI actions into commercetools API calls. This layer exists to
    * Reduce the complexity of the UI
    * Hide any secrets from the UI, so customers can't get hold of internal information
* commercetools: The commercetools platform
* Worldpay RAFT: The Worldpay RAFT payment gateway, providing API endpoints for financial transactions.

The following components are present in the connector:

* Package @gradientedge/worldpay-raft-messages (block 'Messages' in the diagram): this package defines the message types of the RAFT messages and validation functions to verify if a message meets the required structure. Validation includes:
    * Required fields need to be present
    * The format of fields need to meet the requirements (i.e. string length)
    * Patterns are checked as well (i.e. numerical, YY-DD date format, ...)
* Package @gradientedge/worldpay-raft-connector (block 'Connector' in the diagram): this package contains the majority of the code for that connector, and is limited to the common parts of a connector that can be deployed in the cloud or commercetools connect.
    * No cloud-vendor specific code is included here
    * No assumptions on the format of the incoming message are built-in
    * The configuration of this package is passed in via an `initialize` function, which takes an object with settings. The creation of this settings object is the responsible of the deployed application, and could use environment variables, AWS SecretManager, a configuration file or any other means.
    * Within the connector package, a number of parts exist:
        * raft-controller: the entry point for a message, where it is passed on to the handler
        * handlers: each handler is dedicated to one RAFT API (i.e. Credit, Debit, GiftCard, System, APM, ...)
        * processors: each processor is for a specific endpoint, for example `CreditAuthProcessor`, `CreditCompletionProcessor`, `GiftCardPreAuthProcessor`, `SystemHealthProcessor`, etc. Files are organized in a folder per API (i.e. credit, gift-cards, ...) and one file per endpoint (auth, completion, refund).
            * It validates that it has received a valid message for this endpoint
            * If the message is valid, it invokes RAFT via the `raft-connector`
            * When the response is received, it builds the update actions specific for this type of message, using the `action-builder` helpers
        * Action-builder: when a response is received from RAFT, the connector will reply to the commercetools call with a list of `PaymentUpdateAction`s. The action-builder provides a function to build these actions. 
        * raft-connector: the function that invokes RAFT via HTTPS, using the processor's endpoint and message.
* Package @gradientedge/worldpay-raft-transformers (block 'Transformers' in the diagram): this package has two major parts
    * model: the generation of elements that can be added to a message. They can be considered the 'atoms' of a message, for instance a `MiscAmountsBalances` part of a `creditauth` message for credit authorization can be constructed by calling the model's `withMiscAmountsBalances(amount)` function.
    * flows: this is an opinionated collection of message flows, that use commercetools objects like the Cart or a Customer to build a RAFT message. The model elements are used by this package
* There are different possibilities for connector deployment into the infrastructure, each supported by a minimal block of code, using the connector package for the bulk of the functionality:
    * Keystone lambda: this is not included in the connector repository, but Gradient Edge use the RAFT connector via this module inside of the Keystone reference shop
    * AWS lambda: An AWS lambda deployment of the connector, exposing it as a serverless application that receives AWS EventBridge messages directly from commercetools.
    * commercetools connect Application: the connector can be deployed in commercetools infrastructure as a [Connect application](https://commercetools.com/products/connect). Doing so, will automatically register the connector as listener for Create/Update payment events, using an express server to handle incoming https payloads.
    * Docker Application: The same connector with express application, but now packaged as a Docker container, to be deployed locally or in the cloud (i.e. Kubernetes).
* The timeout-handler is an endpoint (depicted as a separate application) that deals with timeouts and retries. A timeout is handled in the connector by persisting the transaction as `Pending` in commercetools. The timeout-handler component queries commercetools for payments that have pending transactions, and for each one found triggers a retry by updating a `retryCount` property in the transaction. When a timeout occurs in the connector, the request field is kept. The update of the payment transaction will trigger an event, and with the request populated, the connector will send the same message to RAFT.


### Flows

Flows is the term we use for specific use cases that need to be supported by a site. An example of a flow is credit authorization with a low value token. Another example is authorization reversal, where a previously authorized payment transaction is reversed as a cancellation.
Data from the original authorization needs to be included in the cancellation request. Flows use transformers to construct (parts of) the message to be sent to RAFT.

To achieve this, we assume the code for that user store is running in the API layer, for instance triggered by a customer clicking on a 'Cancel order' button from their
order history. From the UI, a call into the API layer will activate the following:

* Load the order from commercetools
* Search and find the authorized payment for which cancellation must be invoked (a cancellation is a creditauth call)
* With the corresponding payment, invoke the `creditAuthCancel` as defined below, building the message to be sent to RAFT
* (Optional step): validate the message using the `validateCreditAuth` function. Any missing or unsupported fields (i.e. a numerical string hold alphabetic characters) will cause validation errors without passing information to commercetools, the connector and RAFT (fails early)
* Save the message in `payment.custom.fields.request`, which represents the next request to send to RAFT. The payment is stored by invoking the commercetools payment endpoint
* commercetools sends an `Updated` message to the worldpay RAFT connector, including the request that was just added 
* The connector extracts the request, validates it and invokes the corresponding RAFT endpoint with the message
* The response is processed by the connector by transforming it into a number of update actions, that are included in the response to commercetools
* commercetools merges the actions from the API call with the update actions it received from the RAFT connector, and persists the updated payment object
    * In case of errors, commercetools will **not** save any changes and throws an error back to the calling application
    * The API layer normally catches this error, and reports a failure to the UI
* Depending on the flow, the UI displays an error message or handles the failure in some other way. In the case of order cancellation, a message "Order cancellation failed, please try again" could be displayed to the customer.

![Sequence diagram of a payment authorization](Standard\ payment\ flow.drawio.svg)

In case of cancellation, the previous payment is passed in to extract relevant information like the `APITransactionID` and other data.
There will be flows that take in a few more objects (i.e. the customer profile, the shopping cart, etc.). This information can be loaded
before invoking the function, thus keeping the flows and message transformers independent of the commercetools APIs.
They only are aware of the object structures.

Message transformers like `withEncryptionTokenData` produce a (small) part of the entire message that is constructed.
Their input differs, some require no parameters at all (i.e. `withLocalDateTime`) but passing in a value will override the default (which takes the current data/time).
Others, like `withEncryptionTokenData` receive an object with each of the attributes of `EncryptionTokenData` as an optional property.
Constructing messages with these 'atomic' elements is a straightforward exercise. With the validation function available as well, the
message should adhere to the WorldPayRAFT specifications.


```TypeScript

export interface CreditAuthCancelParams {
  worldpayMerchantID: string
  STPBankId: string
  STPTerminalId: string
  payment: Payment
  amount?: TypedMoney // Optional, if not found, the amount of the authorized transaction is used
  reversalAdviceReasonCd?: ReversalAdviceReasonCd
}

/**
 * Create a creditauth message from the given input parameters, to (partially) cancel a previously authorised transaction
 * @param options - The entities required to build the message
 * @returns The creditauth message
 * @throws {Error} If no authorized transaction to reverse is found in the payment
 */
export function creditAuthCancel(options: CreditAuthCancelParams) {
  const transaction = options.payment.transactions.find((t) => t.type === 'Authorization' && t.state === 'Success')
  if (!transaction) {
    throw new Error('No authorized transaction to reverse found in payment')
  }

  return {
    creditauth: {
      ...withMiscAmountsBalances(options.amount ?? transaction.amount, transaction.amount),
      ...withSTPData(options.STPBankId, options.STPTerminalId, transaction.interactionId),
      ...withWorldpayMerchantID(options.worldpayMerchantID),
      ...withAPITransactionID(options.payment.interfaceId),
      ...withReversalAdviceReasonCd(options.reversalAdviceReasonCd ?? ReversalAdviceReasonCd.NormalReversal),
      ...withEncryptionTokenData({ TokenizedPAN: options.payment.custom?.fields?.tokenizedPAN }),
      ...withProcFlagsIndicators({ PriorAuth: BooleanString.YES }),
      ...withAuthorizationType(AuthorizationType.Reversal),
      ...withLocalDateTime(),
    },
  }
}
```

### Gift Cards

When using gift cards in commercetools, we expect that a customer can pay with a gift card that (partially) covers the order price. When the gift card does not cover the entire price, the remainder of the purchase must be paid with another payment method. Note that it is possible that the 2nd (or 3rd) payment method is a gift card as well.

For each payment method a separate payment object must be created in commercetools. Each then has its own transactions and is updated separately. There are two ways to deal with gift cards, each having its own complications:

#### Add a gift card to the shopping cart based on inquiry

The sequence of events is the following:

* When adding a gift card as payment during checkout, a payment is created and a RAFT request is added to it to perform a `GiftCardInquiry`
* The inquiry is added as the amountPlanned on the payment object, as well as the gift card details (PAN, expiry date, gift card security number)
* The amount due is calculated, and the payment page displays the amount due and asks for payment (credit card, Apple Pay, Google Pay or an additional gift card)
* Any additional gift card is added as a new payment object - storing the balance and details. Using the same gift card twice should be prevented in this case.
* Once the customer adds a non-gift card payment, an attempt to authorize that payment is made. At this point it is best practice to validate the amount the customer attempts to pay and the total of `amountPlanned` of the gift cards. Changes made to the cart (adding / removing products, changing quantities of delivery options) can impact the price. In case of mismatch, inform the customer and display the new amount due.
* When succeeding, the shopping cart can be converted into an order
* Any gift card used as payment now needs to be processed with a `GiftCardPreAuth` message to RAFT - ensuring the total order price is authorized for payment.
* It is possible that the `GiftCardPreAuth` fails due to insufficient balance (for instance when the same gift card is (partially) used on a different order).
    * Cancel the `GiftCardPreAuth` on any gift card already processed
    * Cancel the `CreditAuth` on the credit card or other payment method
    * Cancel the order (i.e. send an email to the customer informing them about the cancellation)
* Once the order ships, send a `GiftCardCompletion` for each gift card that is charged

To refund to a gift card, the refund can be triggered with a `GiftCardRefund` message to RAFT. Because of the model stored in commercetools, with individual payments representing the gift- and credit-card payments, you will have to define the changes that need to be applied to each payment for the refund(s) to happen.
The connector will receive and process the request for each payment separately.

#### Add a gift card to the shopping cart based on pre-auth

There is a difference in the events when adding the gift card as a pre-auth:

* When adding a gift card, it immediately is sent to RAFT for `GiftCardPreAuth` processing
* The balance of the gift card is decreased at that point, and adding it to a different basket will fail. Checkout displays the amount due by subtracting the successfully authorized amounts of the gift card(s) from the order total
* Modifications in the basket content (any change that impacts the order total) must be followed up by a `GiftCardCancelPreAuth` and a `GiftCardAuth`, to ensure the order total is covered and the gift card is fully used. For example when adding a $4 gift card to a basket and then changing the quatity for the $1 product from 1 to 2 should now authorize $2.
* On checkout payment of the amount due with a credit card, only the `CreditAuth` message is needed to fully authorize the payment on the order. No handling of gift cards is necessary at this point
* In case the shopping cart is abandoned, extra handling is required to remove the authorization of the gift card, to allow the customer to use it on a different cart in the future
* Also now, once the order ships, send a `GiftCardCompletion` for each gift card that is charged

The refund handling is exactly the same as in the other flow.

#### Chosing the right solution

Which of the above flows is best suited for your situation depends on priorities:

* The inquiry based flow may lead to orders who's total amount exceeds their paid amount, forcing follow up by for example cancellation of the order.
* The pre-auth flow has the risk of customers calling to find out why their gift card cannot be added during checkout even though they did not place an order with it yet

The complexity of building either solution is similar, so that is irrelevant for the selection. See the supported flows chapter later on for the available RAFT messages for the Credit and GiftCard end points.

### What if our landscape has no (API) API server or is not a TypeScript application?

First of all, the `transformers` package does not rely on API. The API server could use REST or any other means of communication.
Due to the nature of commercetools, with fairly complex user stories benefit from aggregating logic on a server component which keeps the UI clean and simple.
There is other - perhaps even more compelling reason of security: adding a cancel or refund transaction to an existing payment requires the 'Manage Payments' authorization from commercetools. If application logic executes from the UI directly, passing that authorization to a consumer would enable them to update all payments in the commercetools system. That would obviously be an unacceptable security risk. The addition of an API middle layer mitigates this risk, by keeping authorization there.

If your API component is not written in TypeScript (or JavaScript) you will not be able to use the transformer package.
In that case, there are two patterns to use for the flows:

1. Integrate them in your application that communicates with commercetools to create the payment (this is the default), but rewrite the transformers package in a different programming language. The payment object should be extended with a custom fields `request`, where the message can be stored. When saving the payment object, the connector is called with the payment object as a payload. The connector will extract the `request`, validate it using the `messages` package and if the message is valid, will invoke the RAFT API endpoint that corresponds with the message type (i.e. creditauth will invoke the https://ws-cert.vantiv.com/merchant/servicing/apitransactions/NativeRaftApi/v1/credit/authorization endpoint). By passing in different configuration of `worldpayRaftURL` and `worldpayRaftPath`, the connector will connect to production or a different version.
2. Use the flows inside the connector. This involves creating the payment object in commercetools, passing all information as custom field(s) into the payment object. The connector then has to:
    1. Extract these fields
    2. Decide on the type of message to construct
    3. Load the Customer, Cart and other commercetools object that are needed to build the message
    4. Invoke the flow that generates the message
    5. Validate it
    6. Invoke RAFT, receiving the response
    7. Build the set of update actions that update the payment object

Because of the additional complexity with the 2nd construction, the connector only offers option 1 at the moment. The main reason is to avoid loading Cart, Customer and other objects from commercetools during execution of the extension. Commercetools sets a timeout of maximum 10s on the payment extension, and if no response is received within that time, the action is reverted. Reverting the action means no create/update is persisted in commercetools, but if a request was sent out to RAFT, that may still get processed, leading to inconsistencies.

To modify the connector for the 2nd option, follow these steps:

#### Installation

* Extend the commercetools payment object with all properties that are required in a message. The request property holds the entire message can no longer be constructed in the API layer, so either populate individual custom fields, or include a single JSON encoded string

#### In the API application

* Store the values for these properties in the payment object when creating or updating it via your API logic

#### In the connector

* Extend the configuration of connector with credentials to access commercetools. Depending on the steps below, ensure sufficient authorization is assigned
* Pass the additional configuration to the connector upon startup (i.e. by adding them in the Docker application or the commercetools connect app)
* When processing messages, extract the additional custom fields from the payment object
* Load the Customer, Cart and other object(s) that are needed to construct the messages with the transformers directly from commercetools
* Use the existing flows or build additional flows to construct the messages, passing the payment, custom fields, cart, customer, etc.
* Extend the processing of the response to include additional updates to the payment object
    * Potentially also update the customer, cart and other objects outside the payment by directly invoking commercetools update APIs

Be aware that loading the cart, storing updates to the cart and invoking the RAFT API endpoints all need to happen
within the commercetools-defined timeout of the payment API extension, otherwise the updates to the payment will not
be persisted. That in itself is problematic, but when invoking write operations to customer and/or cart, additional
complexity is introduced with partially persisted updates that may require reverting changes or repairs.

# Supported flows

The following flows are supported in the connector. It is easy to add more flows, or adapt the existing ones by adding or removing attributes.
Each 'block' of data like the `MiscAmountsBalances` has its own message constructor, usually named `withXYZ` for type `XYZ`. So that would be `withMiscAmountsBalances`.

The code is organised in folders flows (for flows) , and within those the API endpoint (credit, debit, ...).
The model folder has sub-folder for the type of commercetools object it needs (cart, customer-cart, customer, general).

Function creates an object, that can be included in the message with the `...` operator, so the message constructor becomes a sequence of `...withXYZ` calls.

```TypeScript
import { withMiscAmountsBalances } from '../../model'

const message = {
  ...withMiscAmountsBalances(order.totalAmount),
  ...withCustomerInformation(customer),
  ...withLevel3Data(order),
}
```

## Credit authorization

The credit authorization supports a number of different flows. All flows use the payment information provided by the customer and pass it on to RAFT for processing.
Upon return, a number of attributes are available in the response, that are required for subsequent transactions (i.e. cancel, refund, completion), so the connector stores these on the transaction or the payment object that is persisted in commercetools.

| Attribute | description |
|-----------|-------------|
| custom.fields.request | Holds the request to send to RAFT upon payment creation / update from the API layer. The process clears the field, to avoid sending the request again upon update of the payment object |
| paymentMethodInfo.name | The name of the payment method used (i.e. Card for credit card). This is a translated field, and we supply the `en` translation only by default. |
| paymentMethodInfo.method | The type of credit card (i.e. Discover or Visa) |
| interfaceId | APITransactionID |
| paymentStatus.interfaceCode | The latest ReturnCode received from RAFT |
| paymentStatus.interfaceText | The latest ReasonCode received from RAFT |
| custom.fields.tokenizedPAN | The tokenized PAN, required for subsequent transactions |
| custom.fields.STPReferenceNUM | The STPReferenceNUM of the authorization |

A new transaction of type `Authorization` will be added, with a state that is:

* `Success` if the response from RAFT was a success and the authorization occurred
* `Failure` when the response was a denied transaction from RAFT
* `Pending` if RAFT did not respond at all. Any payment with a transaction in the `Pending` state will be picked up by the retry mechanism

When a payment action leads to a `Pending` transaction, we advise to act towards the customer as if it was successfull (i.e. place the order), but internally hold any processing until the action is confirmed.
For instance, hold the fulfilment processing until the payment authorization is confirmed in the retry mechanism.

In case the outcome of the retry is negative, you need to handle the processing as well:

* Cancel the order - inform the customer
* The retry logic will start sending a Reverse transaction for a number of times to revert any transaction that arrived at RAFT but failed to be received (or processed) by the connector. In rare cases that revert may also fail, in which case manual processing could be required. However, with a sufficiently large window for retries those should be extremely rare.

### Credit authorization with low value token

Using eProtect, a low value token is obtained, when the customer enters their credit card (or PIN-less debit card).
With that token, an authorization is attempted, and the returned TokenizedPAN is stored in the payment for subsequent transactions.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| lowValueToken | The Low Value Token as obtained from eProtect |
| apiTransactionID | A unique transaction id |
| partialCompletionExpected | A boolean flag that is true when multiple partial completions are expected. If so, sequence number 0 of 99 will be included in the authorization. |
| cart | The commercetools shopping cart |
| expirationYYMM | Optional string with the year and month of the card expiration date |
| userDefinedData? | Optional user defined data |
| reversal | Optional boolean to define if the authorization is a reversal |
| authorizationType | Optional AuthorizationType (ForcePost or RV) |

This flow creates a transaction of type `Authorization` in commercetools.

### Credit authorization with CCV2 token

In this flow, the tokenized PAN is already available in commercetools, and stored against the customer profile. The customer is shown a list of stored cards at checkout, and picks one to use. Using eProtect, the encrypted CCV2 number for that card is collected, and a payment attempt is made with encrypted CCV2 and tokenized PAN.

| parameter             | description |
|-----------------------|-------------|
| worldpayMerchantID    | The WorldPay Merchant identifier |
| STPBankId             | The STP Bank ID that was assigned to you |
| STPTerminalId         | The STP Terminal ID that was assigned to you |
| lowValueCVV2Token     | The Low Value Token as obtained from eProtect |
| tokenizedPAN          | The tokenized PAN that was |
| apiTransactionID | A unique transaction id |
| partialCompletionExpected | A boolean flag that is true when multiple partial completions are expected. If so, sequence number 0 of 99 will be included in the authorization. |
| cart | The commercetools shopping cart |
| expirationYYMM | Optional string with the year and month of the card expiration date |
| userDefinedData? | Optional user defined data |
| reversal | Optional boolean to define if the authorization is a reversal |
| authorizationType | Optional AuthorizationType (ForcePost or RV) |

Also this flow creates a transaction of type `Authorization` in commercetools.

### Credit authorization with PAN (*Not PCI compliant*, use for test/certification purposes only)

To support certification testing other non-production flows, this authorization uses the non-encrypted PAN and CCV2 number to request an authorization.
Because the information is stored in commercetools non-encrypted, you cannot use this flow for production purposes, as unencrypted credit cards stored in commercetools would break PCI compliance.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| pan | The unencrypted PAN |
| ccv | The unencrypted CCV code |
| avsOnly | Is the request to be used for Address Verification Service only (amount of $0) |
| partialCompletionExpected | A boolean flag that is true when multiple partial completions are expected. If so, sequence number 0 of 99 will be included in the authorization. |
| cart | The commercetools shopping cart |
| expirationYYMM | Optional string with the year and month of the card expiration date |
| userDefinedData? | Optional user defined data |
| reversal | Optional boolean to define if the authorization is a reversal |
| authorizationType | Optional AuthorizationType (ForcePost or RV) |

Also this flow creates a transaction of type `Authorization` in commercetools.

## Credit completion

The credit completion flow takes a payment as input, which holds the original transaction for Authorization. You can load this from the cart (or order) that was placed:

```TypeScript
order.payments?.find((payment) => payment?.transactions?.any((t) => t.type === 'Authorization' && t.state === 'Success'))
```

This assumes there is only one successful authorization for the order, which is the case if the order was paid with a single payment method (i.e. credit card or gift card).
If that is not the case, please adapt the code above to match your situation.

With this payment, invoke the credit completion flow:

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The commercetools payment object that holds the successful authorization transaction |
| authorizationType | Optional AuthorizationType (ForcePost or RV) |

The payment holds field `tokenizedPAN` from the successful authorization, so that is used to identify the credit card to complete the transaction upon.
The interactionId stored on the `payment` object serves as the STPReferenceNUM.

The amount that is completed is assumed to equal the amount on the Authorization transaction, but if that is missing, property `amountPlanned` on the `payment` is used instead. 

The outcome of this flow is a transaction of type `Charge`, the commercetools term for completion.

### Partial completion

Partial completion completes an amount less than the total authorized amount, and is meant to support the customer when a single order has multiple shipments, and each shipment leads to a separate completion.
Commercetools supports modelling of shipments each linking to a part of the order, but that functionality may or not be used by the client.
Instead of forcing an implementation to use `order.shippingInfo.deliveries` and requiring an integration between an order management system and commercetools to keep the deliveries in-sync, we decided to keep the 
implementation indepent from deliveries. The flow for partial completion assumes an external source for information about the number of completions, the current completion sequence number and whether the completion is final. 

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| transactionAmount | The amount to complete in this transaction |
| paymentSequenceNumber | The sequence number of this completion |
| paymentSequenceCount | The total number completions for this payment |
| isFinalShipment | Is this completion charging for the final shipment? |
| payment | The commercetools payment object that holds the successful authorization transaction |
| authorizationType | Optional AuthorizationType (ForcePost or RV) |

The outcome is a new transaction of type `Charge`.

## Credit cancellation

By default, the cancellation cancels the entire payment, and uses the `interactionId` and `amount` from the transaction with `type:state` equal to `Authorization:Success`.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The payment that needs to be cancelled, it must have a valid transaction of type Authorization, with state Success |
| amount | Optional amount, that overrides the amount taken from the above transaction |
| reversalAdviceReasonCd | Optional reason, which defaults to NormalReversal | 

This flow will produce a transaction of type `CancelAuthorization`.

## Credit refund

By default, the refund uses the entire payment as amount, but it supports passing in an optional amount.
There is no check on the amount, so it is possible to exceed the original payment amount.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| apiTransactionID | The transaction ID, which is a unique 16-char string. You can use function `generateTransactionId` to generate a value |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The payment that needs to be refunded, it must have a valid transaction of type Charge, with state Success |
| amount | Optional amount, that overrides the amount taken from the above transaction |
| reversalAdviceReasonCd | Optional reason, which defaults to NormalReversal | 

A new transaction of type `Refund` will be created by this flow.

## Gift Card Inquiry

The gift card is queried for the balance, and the result is stored in the amountPlanned attribute. There is no transaction created on the payment yet, as no `Authorization` or `Charge` takes place at this point.
Information of the gift card is stored to allow this payment to be used for a gift card pre-auth at a later point in time. That avoids the need for the customer to re-enter the data at checkout.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| apiTransactionID | The transaction ID, which is a unique 16-char string. You can use function `generateTransactionId` to generate a value |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| pan | The PAN of the gift card as entered by the customer (trim leading and trailing spaces) |
| expirationDate | The expiration year and month as entered by the customer (YYMM format, for instance 2512 for December 2025)
| gcSecurityCode | The Gift Card security code as entered by the customer |

There will be no transactions added to the payment for this flow.

## Gift Card Pre-Auth

Reserve an amount in the gift card. When reserving the amount, the flow assumes a previous inquiry was executed already, storing the PAN, expiry date and gcSecurityNumber on the payment. When you don't call the inquiry before using the Pre-Auth, save this information on the payment object together with the request.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| apiTransactionID | The transaction ID, which is a unique 16-char string. You can use function `generateTransactionId` to generate a value |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| order | The Order or Cart for which the pre-auth is being processed **with the payments expanded** |
| payment | The gift card payment that should be pre-authorized. That payment must hold information about the gift card (PAN, expiry date and gcSecurityNumber) as well as the `amountPlanned`. The pre-auth will authorize the full amount planned unless the cart amount due is less than that. 

For information on how to expand payments when loading an Order or Cart, see the [documentation on reference expansion](https://docs.commercetools.com/api/general-concepts#reference-expansion) on the commercetools site.

The request will attempt to pre-authorize the gift card and upon success a new transaction of type `Authorization` with state `Success` will be created. A failure will create the transaction with state `Failure` and if there is no response from RAFT, the transaction will have state `Pending` and the retry mechanism will attempt to authorize it later.

## Gift Card Completion

Charge a gift card that was previouly pre-authorized. The amount is the same as the authorization.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| apiTransactionID | The transaction ID, which is a unique 16-char string. You can use function `generateTransactionId` to generate a value |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The gift card payment that was pre-authorized. That payment must hold information about the gift card (PAN, expiry date and gcSecurityNumber) as well as the `amountPlanned`. The pre-auth will authorize the full amount planned unless the cart amount due is less than that. 
| authorizationType | The (optional) authorization type (FP = Force Post, RV = Reverse) that is sent. If omitted the FP value is automatically added.
| transactionAmount | The (optional) amount to be completed. If omitted, the full pre-authorized amount is completed |

The payment must have a transaction of type:state `Authorization:Success` for the action to complete successfully. A new transaction of type `Charge` with state `Success`, `Failure` or `Pending` will be the outcome of this action.

## Gift Card Cancel Pre-Auth

To cancel a pre-auth, use the `giftCardCancelPreAuth` flow.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The gift card payment that was pre-authorized. That payment must hold information about the gift card (PAN, expiry date and gcSecurityNumber) as well as the `amountPlanned`. The pre-auth will authorize the full amount planned unless the cart amount due is less than that. 
| authorizationType | The (optional) authorization type (FP = Force Post, RV = Reverse) that is sent. If omitted the FP value is automatically added.
| transactionAmount | The (optional) amount to be completed. If omitted, the full pre-authorized amount is cancelleD |

The full amount of the authorized transaction is cancelled, and a new transaction of type `CancelAuthorization` will be added.

## Gift Card Refund

To refund to a gift card, use `giftCardRefund`. The amount is taken from the transaction of type `Charge:Success`.

| parameter | description |
|-----------|-------------|
| worldpayMerchantID | The WorldPay Merchant identifier |
| STPBankId | The STP Bank ID that was assigned to you |
| STPTerminalId | The STP Terminal ID that was assigned to you |
| payment | The gift card payment that should be pre-authorized. That payment must hold information about the gift card (PAN, expiry date and gcSecurityNumber) as well as the `amountPlanned`. The pre-auth will authorize the full amount planned unless the cart amount due is less than that. 
| authorizationType | The (optional) authorization type (FP = Force Post, RV = Reverse) that is sent. If omitted the FP value is automatically added.

The full amount of the charged transaction is refunded, and a new transaction of type `Refund` will be added.

# Retries and reversals

As mentioned above, the timeout-handler triggers a message re-send. That allows for retransmission of the same message multiple times:

* The timeout of a RAFT message is processed within the commercetools timeout - so the response of the connector is received and processed by it. If the commercetools timeout is hit, the entire creation or update of the payment object is reverted - no traces left (even though a message was sent to RAFT). 
* The timeout-handler triggers a re-send of a message by updating the `retryCount` property, thus triggering an event to the connector. The exiting `request` property still holds the message from the previous attempt.
* Once the `maxTries` is reached, the timeout-handler modifies the message in the `request` field by changing its AuthorizationType to `RV - Reversal` and updates the `retryCount` to a negative number - signalling a revert of the original message is happening.
* The reversal messages are also retried for `reverseMaxRetries` times
* The processors
    * Add a transaction with state `Pending` when a RAFT timeout happens, and omit whiping the `request` field
    * Update that existing transaction if found and a success / failure is received from RAFT
    * Change the existing transaction to `Failure` if a successful RV response is received - to flag that the original transaction did not complete as intended

As described in the deployment guide, the amount of time of retries run depends on the frequency of the invocation of the timeout-handler.

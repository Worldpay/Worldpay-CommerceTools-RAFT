# Worldpay RAFT connector

This connector provides an integration between commercetools and Worldpay RAFT to support payments.
The following features are supported:

* 


## Service

The connector provides a service, which listens to payment `Update` and `Create` events and will connect to the RAFT APIs.
Features:

* Before sending the request into Worldpay RAFT, the message is validated against the data model(s).
* When violations are found, the connector throws an error, which commerctools will pass on to the caller.
* If all validation is passed, the request is sent to the RAFT API, and the response is processed:
    * The request and response are added to the payment as PaymentInteraction objects, to form a log of all interaction
    * The update actions for commercetools to update on the `Payment` object are returned to the caller
* The object model for messages and the validation of these is packaged in a separately releasable JavaScript package, which allows you to integrate this into the code that populates the payment object from actions of the customer on the storefront.


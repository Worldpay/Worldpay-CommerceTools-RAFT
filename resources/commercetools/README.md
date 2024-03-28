## Commercetools Configuration Setup

## Custom Types

Create the custom types by invoking the endpoint https://docs.commercetools.com/tutorials/custom-types#creating-a-custom-type with the types defined in the files:

* customer-types.json for the tokenized cards of a customer
* payment-types.json for the RAFT payment types and interactions
* transaction-types.json for the extensions on the transaction

Also add the payment states by invoking https://docs.commercetools.com/api/projects/states#create-state

* payment-states.json for the states a payment can have

Some files contain an array of objects, which have to be used one at a time.

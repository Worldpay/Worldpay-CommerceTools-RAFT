# `@gradientedge/worldpay-transformers`

## Overview

The functions in this package accept commercetools objects (Cart, Customer, Payment, etc.) and transform them
into (partial) RAFT messages that can be included into communication with the RAFT API.

The package does not access commercetools APIs itself, it only accept objects returned by the API to use
as input for the transformation(s).

Once a RAFT message is stored into a payment object (custom.fields.request), the payment extension is triggered and that will send the message to RAFT.


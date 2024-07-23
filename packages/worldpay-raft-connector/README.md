# `@gradientedge/worldpay-raft-connect`

## Overview

A payment extension that is triggered by payment Create/Update events, which it uses to communicate with Worldpay RAFT.
Once it receives a response from RAFT, a response for commercetools is constructed containing payment update actions, in order to persist the result into the payment object.
It also includes a handler for timed out messages, supporting retries.

## Configuration

This package requires configuration for it to function, see the Deployment Guide for details.

# WonderQ - Take home by David Purdy

WonderQ is a small NodeJS message broker allowing for the publication of arbitrary JSON messages to the  broker.  Messages can be independent published in parallel to the broker and independently consumed.  Confirmation of process completion by occur within process timeout.  If confirmation is not received by timeout, the message is made available for work by other workers to consume.
 
Information about the current state of the broker is available at the `/api/v1/info` endpoint.
  
API documentation is available at the `api-docs` endpoint.

Small linux/bash command line interface available at `scripts/wonderq`

Two small test runners to show functionality available at `scripts/testRun[1|2].sh`

## Basic Quickstart Operation
1. Start server with `./npm start`.  (Debug operation is available at `./DEBUG=wonderq nom start`)
2. Publish JSON messages to the `http://localhost:3001/api/v1/queue` endpoint via POST.  You will receive a unique message ID as a response on enqueue
3. Consume a message for processing at the `http://localhost:3001/api/v1/queue` endpoint via GET.  You will receive a wrappered JSON response containing the message content and some message metadata
4. Update broker with message process completion at `http://localhost:3001/api/v1/queue/:messageId` via POST.
5. Receive current broker status at `http://localhost:3001/api/v1/info` endpoint via GET

## Configuartion Options
1. Server port can be set in `config.js` as `wonderq_port`
2. Message process timeout can be set in `config.js` as `confirmation_timeout`

## CLI Interface
A small, very low-level interface is available in `scripts/wonderq` for command line usage.  Its basic usage is prefaced with `./wonderq -h HOSTADDY` like `./wonderq -h localhost:3001`
* To publish a message `./wonderq -h HOSTADDY -p "{JSON MESSAGE}"`
* To consume a messsage `./wonderq -h HOSTADDY -g`
* To mark a message processed `./wonderq -h HOSTADDY -c MESSAGE_ID`
* To get broker information `./wonderq -h HOSTADDY -i`

## Test Runs

There are two test runs to show broker behavior.  

####TestRun1.sh
This script publishes a message to the broker, and then waits 2 seconds.  Then it consumes a messages from the broker and then marks it complete after 2 seconds.  Expected behavior is that the broker will receive a message, hand a message out, and then recoginize the message as processed and remove from the queue.

####TestRun2.sh
This scripts publishs a message to the broker, and then waits 2 seconds.  Then it consumes a message from the broker and waits over the timeout of 10 seconds, forcing the message to be returned to the work queue.  Then it consumes a message again, waits 2 seconds, then marks that message ID as complete.  Expected behavior is that hte broker will end up in a empty state despite the first timeout failure.

## Discussion

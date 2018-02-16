var express = require('express');
var router = express.Router();

var Message = require('../model/message');

router.get('/', function(req, res, next) {
    if (work.isEmpty()) {
        res.status(404).send('No messages for delivery');
    } else {
        var message = work.dequeue();
        message.dequeueTime = Date.now();
        pending.set(message.id, message);
        res.status(200);
        res.json(message);
    }
});

router.post('/', function(req, res, next) {
    console.log("Enqueueing: " + req.body);
    var mess = new Message(req.body);
    work.enqueue(mess);
    res.send(mess.id);
});

router.route('/:messageId')
    .post(function(req, res, next) {
        let messageId = req.params.messageId;
        console.log("Received complete message for id: " + messageId);
        pending.delete(messageId);
        res.status(200);
        res.send("complete")
    });

module.exports = router;

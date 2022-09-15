"use strict"

require('dotenv').config();
const crypto = require('crypto');

let _correlationId = ''
let _cb;

class Message {
    constructor (connection, channel, replyQueue) {

        this.connection = connection;
        this.channel = channel;
        this.replyQueue = replyQueue;

    }

    sendMessage (queueName, correlationId, message) {
        _correlationId = correlationId
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), 
            {
                persistent: true,
                replyTo: this.replyQueue,
                correlationId: _correlationId
            }
        );
    }

    getMessage(correlationId, cb) {
        _correlationId = correlationId;
        _cb = cb;
        console.log(`[x] Waiting for a message...`);

        this.channel.consume(this.replyQueue, this.onMessage);
    }

    onMessage(msg) {

        if(msg.properties.correlationId === _correlationId) {

            _cb(msg.content.toString());
        }   
    }

}

module.exports.Message = Message;

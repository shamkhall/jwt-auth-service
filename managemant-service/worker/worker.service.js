class Worker {
    constructor (channel) {
        this.channel = channel;
    }


    executeMessage (queueName) {
        console.log(`[x] Waiting for request...`);

        this.channel.consume(queueName, (msg) => {

            this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({status: 201, message: "created"})), {
                correlationId: msg.properties.correlationId
            });
            
            this.channel.ack(msg);

        });
    }
}

module.exports.Worker = Worker;
const amqp = require('amqplib');
const crypto = require('crypto');

const argvs = process.argv.slice(2);

(async () => {
    const connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672/');
    const channel = await connection.createChannel();

    const queue = await channel.assertQueue('', {
        exclusive: true
    });

    const correlationId = crypto.randomUUID();
    
    const num = +argvs[0];

    console.log(`[x] Requesting fib(${num})`);

    channel.consume(queue.queue, (msg) => {
        if(msg.properties.correlationId == correlationId){
            console.log(`[x] Got ${msg.content.toString()}`);
        }
    }, {
        noAck: true
    })

    channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: queue.queue
    })

})();



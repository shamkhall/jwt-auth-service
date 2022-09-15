const amqp = require('amqplib');


(async () => {
    const queue = 'test_the_db';

    const connection = await amqp.connect(process.env.RABBITMQ_CONNECTIONSTRING);

    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.prefetch(1);

    console.log(`[x] Waiting for request...`);

    await channel.consume(queue, (msg) => {
        const n = msg.content.toString();

        console.log(`[.] message:${n}`);

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(`your message is ${n}`), {
            correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
        
    })

})();


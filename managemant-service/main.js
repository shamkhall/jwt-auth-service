const { createConnection } = require("typeorm");
const redis = require('redis');
const amqp = require('amqplib');
const { Options } = require("./conf/options");
const {Worker} = require('./worker/worker.service')

async function bootstarp () {

    console.log('The Management Service is starting...');

    // configuration
    const options = new Options();

    // postgres
    const connection = await createConnection(options.getPostgresOptions());
    console.log('[x] The psotgres service is connected.');
    
    // redis
    const connectToRedis = redis.createClient(options.getRedisOptions());
    console.log('[x] The redis service is connected.');

    // rabbitMQ
    const connectToMQ = await amqp.connect(options.getRabbitOptions().url);
    console.log('[x] The rabbitMQ service is connected.');

    
    const channel = await connectToMQ.createChannel();
    const queue = 'test_the_db';
    await channel.assertQueue(queue, {
        durable: true,
    })
    const worker = new Worker(channel);

    worker.executeMessage(queue);

    
}

bootstarp();
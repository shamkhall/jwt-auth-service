"use strict"

// builtin modules
const crypto = require('crypto');

// internal modules
const { AuthService } = require('./src/auth/auth.service');
const { AuthController } = require('./src/auth/auth.controller');
const { Message } = require('./src/messages/message.service');
// external packages
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const amqp = require('amqplib');
require('dotenv').config();

// variables
const packageDef = protoLoader.loadSync('./conf/auth.proto', {
     keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
});
const grpcOpject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcOpject.authPackage;
const PORT = 5000;

async function bootstrap () {

    // rabbitMQ configuration
    const queue = 'test_the_db';
    const connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672/');
    const channel = await connection.createChannel();
    const replyQueue = await channel.assertQueue('', {exclusive: true});
    await channel.assertQueue(queue, {durable: true});
    const message = new Message(connection, channel, replyQueue.queue, crypto.randomUUID());
    // Objects
    const authService = new AuthService(message);
    const authController = new AuthController(authService);

    // gRPC configuration
    const server = new grpc.Server();
    server.bind(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())

    function rgst (a, b) {
        return authController.register(a, b);
    }

    function lgn (a, b) {
        return authController.login(a, b);
    }

    server.addService(authPackage.Auth.service, {
        register: async (a, b) => await authController.register(a, b),
        login: lgn,
        refreshToken: authController.refreshToken,
        // isAuthorized: userController.isAuthorized,
        // getAll: userController.getAll
    })
    console.log(`[x] Server is running (http://localhost:${PORT})...`);
    server.start();

}

(async () => {
    await bootstrap();
})()

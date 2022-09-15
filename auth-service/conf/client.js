// external packages
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const crypto = require('crypto');
// variables
const packageDef = protoLoader.loadSync('auth.proto', {})
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.authPackage;
const PORT = 5000;

const username = process.argv[2];

const user = {
    userId: crypto.randomUUID().toString(),
    username: 'username',
    password: 'password',
}

const client = new authPackage.Auth(`localhost:${PORT}`, grpc.credentials.createInsecure())

console.log('client is sending data...');


client.register (user, (error, response) => {
    console.log(response);
});

// client.login (user, (err, response) => {
//     console.log(response)
// })

// client.refreshToken ({refreshToken: ''}, (err, response) => {
//     console.log(response)
// })

// client.isAuthorized ({accessToken: text}, (err, response) => {
//     console.log('testing...', response);
// })

// client.getAll ({}, (err, response) => {
//     console.log(response);
// })

"use strict"

const crypto = require('crypto');
const { createAccessToken, createRefreshToken, verify } = require('./tokens.js');
const argon2 = require('argon2');

class AuthService {

    constructor (messageService) {
        this.messageService = messageService;
        this.callCount = 0;
    }
    
    async registerService (data, callback) {

        try {

            const queue = 'test_the_db';
            const correlationId = crypto.randomUUID();

            if(data) {

                let {username, password} = data;

                password = await argon2.hash(password);

                this.messageService.sendMessage(queue, correlationId, {username: username, password: password});
            }

            this.messageService.getMessage(correlationId, (response) => {
                const res = JSON.parse(response);

                callback(null, {status: res?.status, message: res?.message});
            });

        } catch(error) {
            callback(null, {
                status: 500,
                message: error
            });
        }
    }

    loginService (credentionals) {
        
        try {

            const {username, password} = credentionals;
        
            const user = ''

            if(!user) return {status: 401, message: 'Unauthorized'};

            const hash = crypto.pbkdf2Sync(password, process.env.PASSWORD_SECRET_KEY,  1000, 64, `sha512`).toString(`hex`);

            if(hash !== user.password) return {status: 401, message: 'Unauthorized'};

            const accessToken = createAccessToken({ username, userId: user.userId});
            const refreshToken = createRefreshToken({ username, userId: user.userId});

            user.refreshToken = crypto.pbkdf2Sync(refreshToken, process.env.REFRESH_SECRET_KEY, 1000, 64, 'sha256').toString('hex');

            return { status: 200, message: 'logged in successfuly',  username,  refreshToken,  accessToken}

        } catch (error) {
            return {
                status: 500,
                message: error.message
            }
        }

    }

    updateTokenService (refreshToken) {

        let payload = undefined;
        try{
            payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch (error) {
            return {status: 401, message: 'Unauthorized'}
        }

        const user = ''

        if(!user) return {status: 401, message: 'Unauthorized', accessToken: ''}

        const tokenHash = crypto.pbkdf2Sync(refreshToken, process.env.REFRESH_SECRET_KEY, 1000, 64, 'sha256').toString('hex');

        if(tokenHash !== user.refreshToken) return {status: 401, message: 'Unauthorized', accessToken: ''}

        const newAccessToken = createAccessToken({username: user.username, userId: user.userId});
        const newRefreshToken = createRefreshToken({username: user.username, userId: user.userId});

        user.refreshToken = crypto.pbkdf2Sync(newRefreshToken, process.env.REFRESH_SECRET_KEY, 1000, 64, 'sha256').toString('hex');

        return { 
            status: 204, 
            message: 'Tokens are updated successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }

    protectedRootService () {
        return {
            username: result.user.username,
            data: 'it is protected root'
        }
    }
}

module.exports.AuthService = AuthService;
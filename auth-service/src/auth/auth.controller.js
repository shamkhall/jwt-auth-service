"use strict"


class AuthController {

    constructor (authService) {
        this.authService = authService;
    }

    async register (call, callback) {
        await this.authService.registerService(call.request, callback);
    }
    
    login (call, callback) {
        const result = this.authService.loginService(call.request);
        callback(null, result);
    }
    
    refreshToken (call, callback) {
        const result = this.authService.updateTokenService(call.request.refreshToken);
        callback (null, result);
    }
}

module.exports.AuthController = AuthController;
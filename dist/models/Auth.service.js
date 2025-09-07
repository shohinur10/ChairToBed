"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const config_1 = require("../libs/utils/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.secretToken = process.env.SECRET_TOKEN;
    }
    async createToken(payload) {
        return new Promise((resolve, reject) => {
            const duration = `${config_1.AUTH_TIMER}h`;
            jsonwebtoken_1.default.sign(payload, // user info stored in token (NEVER password!)
            process.env.SECRET_TOKEN, // your secret key (keep safe!)
            {
                expiresIn: duration, // expiration time
            }, (err, token) => {
                if (err)
                    reject(new Errors_1.default(Errors_1.HttpCode.UNAUTHORIZED, Errors_1.Message.TOKEN_CREATION_FAILED));
                else
                    resolve(token);
            });
        });
    }
    async checkAuth(token) {
        const result = (await jsonwebtoken_1.default.verify(token, this.secretToken));
        console.log(`---[AUTH] memberNick: ${result.memberNick}---`);
        return result;
    }
}
exports.default = AuthService;
//# sourceMappingURL=Auth.service.js.map
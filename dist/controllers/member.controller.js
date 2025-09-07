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
const Member_service_1 = __importDefault(require("../models/Member.service"));
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const Auth_service_1 = __importDefault(require("../models/Auth.service"));
const config_1 = require("../libs/utils/config");
const Errors_2 = require("../libs/utils/Errors");
// REACT uchun ishleydu togrirogi SPA 
const memberService = new Member_service_1.default();
const authService = new Auth_service_1.default();
// prject dovomida memberServicesdan kop instance olganimiz uchun unu tashaqari chiqariboldik
const memberController = {};
memberController.getFounder = async (req, res) => {
    try {
        console.log("getFounder");
        const result = await memberService.getFounder();
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("Error, getFounder:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.signup = async (req, res) => {
    try {
        console.log("signup");
        const input = req.body, result = await memberService.signup(input);
        const token = await authService.createToken(result);
        res.cookie("accessToken", token, {
            maxAge: config_1.AUTH_TIMER * 3600 * 1000,
            httpOnly: false,
        });
        res.status(Errors_1.HttpCode.CREATED).json({ member: result, accessToken: token });
    }
    catch (err) {
        console.log("Error, signup:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.login = async (req, res) => {
    try {
        console.log("login");
        const input = req.body, result = await memberService.login(input), token = await authService.createToken(result);
        res.cookie("accessToken", token, {
            maxAge: config_1.AUTH_TIMER * 3600 * 1000,
            httpOnly: false,
        });
        res.status(Errors_1.HttpCode.OK).json({ member: result, accessToken: token });
    }
    catch (err) {
        console.log("Error, login:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
        //   res.json({})
    }
};
memberController.logout = (req, res) => {
    try {
        console.log("logout");
        // Clear the access token cookie regardless of authentication status
        res.clearCookie("accessToken", {
            httpOnly: false,
            path: '/'
        });
        res.status(Errors_1.HttpCode.OK).json({ logout: true, message: "Successfully logged out" });
    }
    catch (err) {
        console.log("Error, logout:", err);
        // Even if there's an error, return success for logout
        res.status(Errors_1.HttpCode.OK).json({ logout: true, message: "Logged out" });
    }
};
memberController.getMemberDetails = async (req, res) => {
    try {
        console.log("getMemberDetails");
        const result = await memberService.getMemberDetails(req.member);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("Error, getMemberDetails:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.updateMember = async (req, res) => {
    try {
        console.log("updateMember");
        const input = req.body;
        if (req.file)
            input.memberImage = req.file.path.replace(/\\/, "/");
        const result = await memberService.updateMember(req.member, input);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("Error, updateMember:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
// Dedicated method for member image updates
memberController.updateMemberImage = async (req, res) => {
    try {
        console.log("updateMemberImage called");
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
        if (!req.file) {
            console.log("No file received in request");
            return res.status(Errors_1.HttpCode.BAD_REQUEST).json({
                error: true,
                message: "No image file provided"
            });
        }
        // Create input with only the image field (no _id needed for update)
        const input = {};
        // Format the image path properly
        input.memberImage = req.file.path.replace(/\\/g, "/").replace(/^\.\//, "");
        console.log("Updating member image:", input.memberImage);
        const result = await memberService.updateMember(req.member, input);
        res.status(Errors_1.HttpCode.OK).json({
            success: true,
            message: "Member image updated successfully",
            member: result
        });
    }
    catch (err) {
        console.log("Error, updateMemberImage:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.getTopUsers = async (req, res) => {
    try {
        console.log("getTopUsers");
        const result = await memberService.getTopUsers();
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("Error, getTopUsers:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (token)
            req.member = await authService.checkAuth(token);
        if (!req.member)
            throw new Errors_1.default(Errors_1.HttpCode.UNAUTHORIZED, Errors_2.Message.NOT_AUTHENTICATED);
        next();
    }
    catch (err) {
        console.log("Error, verifyAuth:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.retrieveAuth = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (token)
            req.member = await authService.checkAuth(token);
        next();
    }
    catch (err) {
        console.log("Error, retrieveAuth :", err);
        next();
    }
};
exports.default = memberController;
//# sourceMappingURL=member.controller.js.map
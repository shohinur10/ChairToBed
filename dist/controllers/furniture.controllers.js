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
const member_enum_1 = require("../libs/enums/member.enum");
const Member_service_1 = __importDefault(require("../models/Member.service"));
const Errors_1 = __importStar(require("../libs/utils/Errors"));
// BSSR - uchun adminka loyihamiz uchun   
const memberService = new Member_service_1.default();
const furnitureController = {};
furnitureController.goHome = (req, res) => {
    try {
        console.log("goHome");
        res.render("home");
        //send / json / redirect / end /render data jonatish turlari 
    }
    catch (err) {
        console.log("Error, goHome:", err);
    }
};
furnitureController.getSignup = (req, res) => {
    try {
        console.log("getSignup");
        res.render("signup");
    }
    catch (err) {
        console.log("Error, getSignup:", err);
        res.redirect("/admin");
    }
};
furnitureController.getLogin = (req, res) => {
    try {
        console.log("getLogin");
        res.render("login"); // This should render the login.ejs view
    }
    catch (err) {
        console.log("Error, getLogin:", err);
        res.redirect("/admin");
    }
};
furnitureController.processSignup = async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.SOMETHING_WENT_WRONG);
        const newMember = req.body;
        newMember.memberImage = file?.path;
        newMember.memberType = member_enum_1.MemberType.FOUNDER;
        console.log("→ [Processing signup for]:", newMember.memberNick);
        const result = await memberService.processSignup(newMember);
        //TODO: SESSIONS AUTHENTICATION
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });
    }
    catch (err) {
        console.log("ERROR, processSignup", err);
        let message = Errors_1.Message.SOMETHING_WENT_WRONG;
        if (err instanceof Errors_1.default) {
            if (err.message === Errors_1.Message.CREATION_FAILED) {
                // Check if it's because founder already exists
                message = "Business account already exists! Please use the login page to access your account.";
            }
            else {
                message = err.message;
            }
        }
        res.send(`<script> 
        alert("${message}"); 
        // Redirect to login if founder exists, otherwise back to signup
        ${message.includes("already exists") ?
            "window.location.replace('/admin/login')" :
            "window.location.replace('/admin/signup')"}
      </script>`);
    }
};
// ✅ FIXED: processLogin moved outside
furnitureController.processLogin = async (req, res) => {
    try {
        console.log("processLogin");
        const input = req.body;
        const result = await memberService.processLogin(input);
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all"); // redirecting to mentioned endpoint
        });
    }
    catch (err) {
        console.log("Error, processLogin:", err);
        const message = err instanceof Errors_1.default ? err.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`
      <script> alert("${message}"); window.location.replace('/admin/login'); </script>
    `);
    }
};
furnitureController.getLogout = (req, res) => {
    try {
        console.log("getLogout - showing confirmation page");
        res.render("logout", { member: req.session.member });
    }
    catch (err) {
        console.log("Error, getLogout:", err);
        res.redirect("/admin/login");
    }
};
furnitureController.logout = async (req, res) => {
    try {
        console.log("logout");
        // Clear any JWT cookies as well (for cleanup)
        res.clearCookie("accessToken");
        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.log("Session destroy error:", err);
                return res.redirect("/admin/login");
            }
            res.clearCookie("connect.sid"); // Clear the session cookie
            res.redirect("/admin/login");
        });
    }
    catch (err) {
        console.log("Error, logout:", err);
        res.redirect("/admin/login");
    }
};
// Add profile page method
furnitureController.getProfile = async (req, res) => {
    try {
        console.log("getProfile");
        res.render("profile", { member: req.member });
    }
    catch (err) {
        console.log("Error, getProfile:", err);
        res.redirect("/admin/login");
    }
};
furnitureController.getUsers = async (req, res) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers();
        res.render("users", { users: result });
        //user  degan page jonatib users degan objectdi  result olqali pas qilishini sorayyapmiz 
    }
    catch (err) {
        console.log("Error, getUsers:", err);
        res.redirect("/admin/login");
    }
};
furnitureController.updatedChosenUser = async (req, res) => {
    try {
        console.log("updatedChosenUser");
        const result = await memberService.updatedChosenUser(req.body);
        //updatedChosenUser da call qilyapmiz req.body ni olib berishi uchun
        res.status(Errors_1.HttpCode.OK).json({ data: result });
    }
    catch (err) {
        console.log("Error, updatedChosenUser:", err);
        if (err instanceof Errors_1.default) {
            res.status(err.code).json({ message: err.message });
        }
        else {
            const error = new Errors_1.default(Errors_1.HttpCode.INTERNAL_SERVER_ERROR, Errors_1.Message.SOMETHING_WENT_WRONG);
            res.status(error.code).json({ message: error.message });
        }
    }
};
// Authentication check  for session
furnitureController.checkAuthSession = async (req, res) => {
    try {
        console.log("checkAuthSession");
        if (req.session?.member)
            res.send(`<script> alert("${req.session.member.memberNick}") </script> `);
        else
            res.send(`<script> alert("${Errors_1.Message.NOT_AUTHENTICATED}") </script>`);
    }
    catch (err) {
        console.log("Error, checkAuthSession:", err);
        res.send(err);
    }
};
// Authorization  middleware
furnitureController.verifyFounder = (req, res, next) => {
    console.log("verifyFounder - checking session:", !!req.session?.member);
    if (req.session?.member?.memberType === member_enum_1.MemberType.FOUNDER) {
        req.member = req.session.member;
        next(); // let to move next step  
    }
    else {
        console.log("verifyFounder - authentication failed, redirecting to login");
        const message = Errors_1.Message.NOT_AUTHENTICATED;
        res.send(`
      <script> alert("${message}"); window.location.replace('/admin/login'); </script>`);
    }
};
exports.default = furnitureController;
//# sourceMappingURL=furniture.controllers.js.map
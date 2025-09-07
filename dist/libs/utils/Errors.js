"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["OK"] = 200] = "OK";
    HttpCode[HttpCode["CREATED"] = 201] = "CREATED";
    HttpCode[HttpCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCode[HttpCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpCode[HttpCode["CONFLICT"] = 501] = "CONFLICT";
})(HttpCode || (exports.HttpCode = HttpCode = {}));
var Message;
(function (Message) {
    Message["SOMETHING_WENT_WRONG"] = "Something went wrong!";
    Message["NO_DATA_FOUND"] = "No data found!";
    Message["UPDATE_FAILED"] = "Update failed!";
    Message["USED_NICK_PHONE"] = "You are inserting an already used nickname or phone number.";
    Message["NO_MEMBER_NICK"] = "No member found with that nickname.";
    Message["BLOCKED_USER"] = "You have been blocked ,contact the restaurant";
    Message["WRONG_PASSWORD"] = "Wrong password!";
    Message["NOT_AUTHENTICATED"] = "You are not authenticated!,Please login first ";
    Message["CREATION_FAILED"] = "CREATION_FAILED";
    Message["TOKEN_CREATION_FAILED"] = "Token creation errors!";
    Message["NOT_FOUND"] = "NOT_FOUND";
    Message["INVALID_POINT"] = "INVALID_POINT";
    Message["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    Message["MEMBER_NOT_FOUND"] = "MEMBER_NOT_FOUND";
})(Message || (exports.Message = Message = {}));
class Errors extends Error {
    constructor(statusCode, statusMessage) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}
Errors.standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
};
exports.default = Errors;
//# sourceMappingURL=Errors.js.map
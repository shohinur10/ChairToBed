export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
    SOMETHING_WENT_WRONG = "Something went wrong!",
    NO_DATA_FOUND = "No data found!",
    UPDATE_FAILED = "Update failed!",
    USED_NICK_PHONE = "You are inserting an already used nickname or phone number.",
    NO_MEMBER_NICK = "No member found with that nickname.",
    BLOCKED_USER ="You have been blocked ,contact the restaurant",
    WRONG_PASSWORD = "Wrong password!",
    NOT_AUTHENTICATED = "You are not authenticated!,Please login first ",
    CREATION_FAILED = "CREATION_FAILED",
    TOKEN_CREATION_FAILED ="Token creation errors!",
    NOT_FOUND = "NOT_FOUND",
    INVALID_POINT = "INVALID_POINT",
}

class Errors extends Error {
    public code: HttpCode;
    public message: Message;

    static standard ={
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: Message.SOMETHING_WENT_WRONG,
    }

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors;

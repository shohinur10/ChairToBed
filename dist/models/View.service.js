"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = __importDefault(require("../libs/utils/Errors"));
const View_model_1 = __importDefault(require("../schema/View.model"));
const Errors_2 = require("../libs/utils/Errors");
const Errors_3 = require("../libs/utils/Errors");
class ViewService {
    constructor() {
        this.viewModel = View_model_1.default;
    }
    // Method to check view existence
    async checkViewExistence(input) {
        const view = await this.viewModel
            .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
            .exec();
        // Return null if view doesn't exist instead of throwing an error
        return view ? view.toObject() : null;
    }
    // Method to insert a new member view
    async insertMemberView(input) {
        try {
            const createdView = await this.viewModel.create(input);
            return createdView.toObject();
        }
        catch (error) {
            console.log("Error model: insertMemberView", error);
            throw new Errors_1.default(Errors_2.HttpCode.BAD_REQUEST, Errors_3.Message.CREATION_FAILED);
        }
    }
}
exports.default = ViewService;
//# sourceMappingURL=View.service.js.map
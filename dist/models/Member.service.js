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
const member_enum_1 = require("../libs/enums/member.enum");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = require("../libs/utils/config");
const Member_model_1 = __importDefault(require("../schema/Member.model"));
class MemberService {
    constructor() {
        this.memberModel = Member_model_1.default;
    }
    async getFounder() {
        const result = await this.memberModel
            .findOne({ memberType: member_enum_1.MemberType.FOUNDER })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.toObject();
    }
    async getMemberDetails(member) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id);
        const result = await this.memberModel.findOne({
            _id: memberId,
            memberStatus: member_enum_1.MemberStatus.ACTIVE
        })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.toObject();
    }
    /** SPA Signup */
    async signup(input) {
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = ""; // Hide password before returning
            return result.toJSON();
        }
        catch (err) {
            console.log("Error , model:signup", err);
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.WRONG_PASSWORD);
        }
    }
    /** SPA Login */
    async login(input) {
        // TODO: Consider member status later
        const member = await this.memberModel
            .findOne({ memberNick: input.memberNick,
            memberStatus: { $ne: member_enum_1.MemberStatus.DELETE },
        }, { memberNick: 1, memberPassword: 1, memberStatus: 1 })
            .exec();
        if (!member)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_MEMBER_NICK);
        else if (member.memberStatus === member_enum_1.MemberStatus.BLOCK) {
            throw new Errors_1.default(Errors_1.HttpCode.FORBIDDEN, Errors_1.Message.BLOCKED_USER);
        }
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        if (!isMatch)
            throw new Errors_1.default(Errors_1.HttpCode.UNAUTHORIZED, Errors_1.Message.WRONG_PASSWORD);
        const foundMember = await this.memberModel
            .findById(member._id)
            .select("memberNick memberType memberStatus memberPoints createdAt updatedAt") // Ensure all required fields are selected
            .exec();
        if (!foundMember)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_MEMBER_NICK);
        return foundMember.toObject();
    }
    async updateMember(member, input) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id);
        // Remove _id from input to avoid conflicts
        const updateData = { ...input };
        delete updateData._id;
        const result = await this.memberModel
            .findByIdAndUpdate(memberId, updateData, { new: true }) // new true - bu obshion 
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        return result.toObject();
    }
    async getTopUsers() {
        const result = await this.memberModel.find({
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
            memberPoints: { $gte: 0 },
        })
            .sort({ memberPoints: -1 }) // Corrected sorting field
            .limit(4)
            .exec();
        if (!result || result.length === 0)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.map(doc => doc.toObject());
    }
    async addUserPoint(member, point) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id);
        console.log("addUserPoint - member info:", {
            id: memberId,
            nick: member.memberNick,
            type: member.memberType,
            status: member.memberStatus
        });
        const result = await this.memberModel
            .findOneAndUpdate({
            _id: memberId,
            // Remove the strict memberType filter - allow both USER and FOUNDER to receive points
            memberType: { $in: [member_enum_1.MemberType.USER, member_enum_1.MemberType.FOUNDER] },
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
        }, { $inc: { memberPoints: point } }, { new: true })
            .exec();
        if (!result) {
            console.log("addUserPoint - No member found with criteria:", {
                _id: memberId,
                memberType: member.memberType,
                memberStatus: member.memberStatus
            });
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        }
        console.log("addUserPoint - Successfully added points. New total:", result.memberPoints);
        return result.toObject();
    }
    /**
    
      /** SSR Signup */
    async processSignup(input) {
        const exist = await this.memberModel
            .findOne({ memberType: member_enum_1.MemberType.FOUNDER }).exec();
        console.log("→ [About to create member]:", input);
        if (exist) {
            console.log("→ [Founder already exists, cannot create another founder account]");
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATION_FAILED);
        }
        console.log("→ [No existing founder found, proceeding with signup]");
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            console.log("→ [Member created successfully]:", result.memberNick);
            return result.toObject();
        }
        catch (err) {
            console.log("→ [Database creation error]:", err);
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATION_FAILED);
        }
    }
    ;
    /** SSR Login */
    async processLogin(input) {
        const member = await this.memberModel
            .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1 })
            .exec();
        if (!member)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_MEMBER_NICK);
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        // const isMatch = input.memberPassword === member.memberPassword;
        if (!isMatch)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATION_FAILED);
        const result = await this.memberModel.findById(member._id).exec();
        if (!result) {
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_MEMBER_NICK);
        }
        return result.toObject();
    }
    async getUsers() {
        const result = await this.memberModel
            .find({ memberType: member_enum_1.MemberType.USER })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.map((doc) => doc.toObject());
    }
    async updatedChosenUser(input) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: input._id }, input, { new: true })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        return result.toObject();
    }
}
exports.default = MemberService;
//# sourceMappingURL=Member.service.js.map
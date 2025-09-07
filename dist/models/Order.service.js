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
const Order_model_1 = __importDefault(require("../schema/Order.model"));
const OrderItem_model_1 = __importDefault(require("../schema/OrderItem.model"));
const config_1 = require("../libs/utils/config");
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const order_enum_1 = require("../libs/enums/order.enum");
const Member_service_1 = __importDefault(require("./Member.service"));
class OrderService {
    constructor() {
        this.orderModel = Order_model_1.default;
        this.orderItemModel = OrderItem_model_1.default;
        this.memberService = new Member_service_1.default();
    }
    async createOrder(member, input) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id);
        const amount = input.reduce((acc, item) => {
            return acc + item.itemPrice * item.itemQuantity;
        }, 0);
        const delivery = amount < 100 ? 5 : 0;
        try {
            const createdOrder = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
            });
            const newOrder = createdOrder.toObject();
            const orderId = createdOrder._id;
            await this.recordOrderItem(orderId, input);
            console.log("Order created:", orderId.toString());
            return newOrder;
        }
        catch (err) {
            console.error("Error in createOrder:", err);
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATION_FAILED);
        }
    }
    async recordOrderItem(orderId, input) {
        const promisedList = input.map(async (item) => {
            item.orderId = orderId.toString();
            item.productId = (0, config_1.shapeIntoMongooseObjectId)(item.productId);
            await this.orderItemModel.create(item);
            return "INSERTED";
        });
        const orderItemState = await Promise.all(promisedList);
        console.log("Order items created:", orderItemState);
    }
    async getMyOrders(member, inquiry) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id);
        const matchQuery = {
            memberId: memberId,
            orderStatus: inquiry.orderStatus,
        };
        const result = await this.orderModel
            .aggregate([
            { $match: matchQuery },
            { $sort: { updatedAt: -1 } },
            { $skip: (inquiry.page - 1) * inquiry.limit },
            { $limit: inquiry.limit },
            {
                $lookup: {
                    from: "orderItems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
        ])
            .exec();
        if (!result) {
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        }
        return result;
    }
    async updateOrder(member, input) {
        const memberId = (0, config_1.shapeIntoMongooseObjectId)(member._id), orderId = (0, config_1.shapeIntoMongooseObjectId)(input.orderId), orderStatus = input.orderStatus;
        const updatedOrder = await this.orderModel
            .findOneAndUpdate({
            memberId: memberId,
            _id: orderId,
        }, { orderStatus: orderStatus }, { new: true })
            .exec();
        if (!updatedOrder)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        const result = await this.orderModel
            .aggregate([
            { $match: { _id: updatedOrder._id } },
            {
                $lookup: {
                    from: "orderItems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
        ])
            .exec();
        if (!result || result.length === 0)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        if (orderStatus === order_enum_1.OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(member, 1);
        }
        return result[0];
    }
}
exports.default = OrderService;
//# sourceMappingURL=Order.service.js.map
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
const Order_service_1 = __importDefault(require("../models/Order.service"));
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const order_enum_1 = require("../libs/enums/order.enum");
const orderService = new Order_service_1.default();
const orderController = {};
orderController.createOrder = async (req, res) => {
    try {
        console.log("createOrder");
        const result = await orderService.createOrder(req.member, req.body);
        res.status(Errors_1.HttpCode.CREATED).json(result);
    }
    catch (err) {
        console.log("Error, createOrder:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
orderController.getMyOrders = async (req, res) => {
    try {
        console.log("getMyOrders");
        const page = Number(req.query.page) || 1;
        const limit = Math.max(Number(req.query.limit) || 5, 1); // Enforce minimum of 1
        const orderStatus = req.query.orderStatus || order_enum_1.OrderStatus.PAUSE;
        const inquiry = {
            page,
            limit,
            orderStatus,
        };
        console.log("inquiry:", inquiry);
        const result = await orderService.getMyOrders(req.member, inquiry);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("Error, getMyOrders:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
orderController.updateOrder = async (req, res) => {
    try {
        console.log("updateOrder");
        const input = req.body;
        const result = await orderService.updateOrder(req.member, input);
        console.log("input:", input);
        res.status(Errors_1.HttpCode.CREATED).json(result);
    }
    catch (err) {
        console.log("Error, updateOrder:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
exports.default = orderController;
//# sourceMappingURL=order.controller.js.map
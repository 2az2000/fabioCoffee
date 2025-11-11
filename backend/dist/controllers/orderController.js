"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const client_1 = require("../prisma/client");
const validation_1 = require("../utils/validation");
const getOrders = async (req, res) => {
    try {
        const { status, tableNumber } = req.query;
        const where = {};
        if (status && typeof status === 'string') {
            where.status = status;
        }
        if (tableNumber) {
            where.tableNumber = parseInt(tableNumber);
        }
        const orders = await client_1.prisma.order.findMany({
            where: where,
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                table: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
            return;
        }
        const order = await client_1.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                table: true
            }
        });
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }
        res.json({
            success: true,
            data: order
        });
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const validationResult = validation_1.createOrderSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        const { tableId, items } = validationResult.data;
        const table = await client_1.prisma.table.findUnique({
            where: { id: tableId }
        });
        if (!table) {
            res.status(400).json({
                success: false,
                error: 'Table not found'
            });
            return;
        }
        const itemIds = items.map((item) => item.itemId);
        const existingItems = await client_1.prisma.item.findMany({
            where: {
                id: { in: itemIds },
                isActive: true
            }
        });
        if (existingItems.length !== items.length) {
            res.status(400).json({
                success: false,
                error: 'Some items not found or inactive'
            });
            return;
        }
        let totalPrice = 0;
        for (const orderItem of items) {
            const item = existingItems.find(i => i.id === orderItem.itemId);
            if (item) {
                totalPrice += Number(item.price) * orderItem.quantity;
            }
        }
        const order = await client_1.prisma.order.create({
            data: {
                tableId,
                tableNumber: table.number,
                totalPrice,
                items: {
                    create: items.map((item) => {
                        const foundItem = existingItems.find(i => i.id === item.itemId);
                        return {
                            itemId: item.itemId,
                            quantity: item.quantity,
                            price: foundItem.price
                        };
                    })
                }
            },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                table: true
            }
        });
        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    }
    catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
            return;
        }
        const { status } = req.body;
        if (!['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].includes(status)) {
            res.status(400).json({
                success: false,
                error: 'Invalid status. Valid statuses are: PENDING, PREPARING, READY, COMPLETED, CANCELLED'
            });
            return;
        }
        const updatedOrder = await client_1.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                table: true
            }
        });
        res.json({
            success: true,
            data: updatedOrder,
            message: 'Order status updated successfully'
        });
    }
    catch (error) {
        console.error('Update order status error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getItems = void 0;
const client_1 = require("../prisma/client");
const validation_1 = require("../utils/validation");
const getItems = async (req, res) => {
    try {
        const { categoryId, search } = req.query;
        const where = { isActive: true };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const items = await client_1.prisma.item.findMany({
            where,
            include: { category: true },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            data: items
        });
    }
    catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getItems = getItems;
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Item ID is required'
            });
            return;
        }
        const item = await client_1.prisma.item.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!item) {
            res.status(404).json({
                success: false,
                error: 'Item not found'
            });
            return;
        }
        const formattedItem = {
            ...item,
            price: Number(item.price)
        };
        res.json({
            success: true,
            data: formattedItem
        });
    }
    catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getItemById = getItemById;
const createItem = async (req, res) => {
    try {
        const validationResult = validation_1.createItemSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        const category = await client_1.prisma.category.findUnique({
            where: { id: validationResult.data.categoryId }
        });
        if (!category) {
            res.status(400).json({
                success: false,
                error: 'Category not found'
            });
            return;
        }
        const cleanData = Object.fromEntries(Object.entries(validationResult.data).filter(([_, value]) => value !== undefined));
        const item = await client_1.prisma.item.create({
            data: cleanData
        });
        const itemWithCategory = await client_1.prisma.item.findUnique({
            where: { id: item.id },
            include: { category: true }
        });
        const formattedItem = {
            ...itemWithCategory,
            price: Number(itemWithCategory.price)
        };
        res.status(201).json({
            success: true,
            data: formattedItem,
            message: 'Item created successfully'
        });
    }
    catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.createItem = createItem;
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Item ID is required'
            });
            return;
        }
        const validationResult = validation_1.updateItemSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        if (validationResult.data.categoryId) {
            const category = await client_1.prisma.category.findUnique({
                where: { id: validationResult.data.categoryId }
            });
            if (!category) {
                res.status(400).json({
                    success: false,
                    error: 'Category not found'
                });
                return;
            }
        }
        const cleanData = Object.fromEntries(Object.entries(validationResult.data).filter(([_, value]) => value !== undefined));
        const item = await client_1.prisma.item.update({
            where: { id },
            data: cleanData,
            include: { category: true }
        });
        const formattedItem = {
            ...item,
            price: Number(item.price)
        };
        res.json({
            success: true,
            data: formattedItem,
            message: 'Item updated successfully'
        });
    }
    catch (error) {
        console.error('Update item error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Item not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Item ID is required'
            });
            return;
        }
        await client_1.prisma.item.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete item error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Item not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=itemController.js.map
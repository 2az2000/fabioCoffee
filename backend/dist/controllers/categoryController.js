"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const client_1 = require("../prisma/client");
const validation_1 = require("../utils/validation");
const getCategories = async (req, res) => {
    try {
        const categories = await client_1.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Category ID is required'
            });
            return;
        }
        const category = await client_1.prisma.category.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!category) {
            res.status(404).json({
                success: false,
                error: 'Category not found'
            });
            return;
        }
        res.json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const validationResult = validation_1.createCategorySchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        const cleanData = Object.fromEntries(Object.entries(validationResult.data).filter(([_, value]) => value !== undefined));
        const category = await client_1.prisma.category.create({
            data: cleanData
        });
        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Category ID is required'
            });
            return;
        }
        const validationResult = validation_1.updateCategorySchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        const cleanData = Object.fromEntries(Object.entries(validationResult.data).filter(([_, value]) => value !== undefined));
        const category = await client_1.prisma.category.update({
            where: { id },
            data: cleanData
        });
        res.json({
            success: true,
            data: category,
            message: 'Category updated successfully'
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Category not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Category ID is required'
            });
            return;
        }
        await client_1.prisma.category.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete category error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Category not found'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map
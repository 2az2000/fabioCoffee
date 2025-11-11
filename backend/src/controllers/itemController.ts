import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createItemSchema, updateItemSchema } from '../utils/validation';
import { ApiResponse, Item } from '../types';

/**
 * Get all items
 */
export const getItems = async (req: Request, res: Response<ApiResponse<Item[]>>): Promise<void> => {
  try {
    const { categoryId, search } = req.query;
    
    const where: any = { isActive: true };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.item.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get item by ID
 */
export const getItemById = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    const item = await prisma.item.findUnique({
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

    // Convert Decimal to number for price
    const formattedItem = {
      ...item,
      price: Number(item.price)
    };

    res.json({
      success: true,
      data: formattedItem
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Create new item
 */
export const createItem = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    const validationResult = createItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validationResult.data.categoryId }
    });

    if (!category) {
      res.status(400).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }

    // Clean data by removing undefined properties
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    const item = await prisma.item.create({
      data: cleanData as any
    });

    const itemWithCategory = await prisma.item.findUnique({
      where: { id: item.id },
      include: { category: true }
    });

    // Convert Decimal to number for price
    const formattedItem = {
      ...itemWithCategory!,
      price: Number(itemWithCategory!.price)
    };

    res.status(201).json({
      success: true,
      data: formattedItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update item
 */
export const updateItem = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    const validationResult = updateItemSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // If categoryId is being updated, check if it exists
    if (validationResult.data.categoryId) {
      const category = await prisma.category.findUnique({
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

    // Clean data by removing undefined properties
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    const item = await prisma.item.update({
      where: { id },
      data: cleanData as any,
      include: { category: true }
    });

    // Convert Decimal to number for price
    const formattedItem = {
      ...item,
      price: Number(item.price)
    };

    res.json({
      success: true,
      data: formattedItem,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Update item error:', error);
    if ((error as any).code === 'P2025') {
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

/**
 * Delete item
 */
export const deleteItem = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    await prisma.item.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    if ((error as any).code === 'P2025') {
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
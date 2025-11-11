import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createOrderSchema } from '../utils/validation';
import { ApiResponse, Order, OrderItem, Table } from '../types';
import { OrderStatus } from '@prisma/client';

/**
 * Get all orders
 */
export const getOrders = async (req: Request, res: Response<ApiResponse<any[]>>): Promise<void> => {
  try {
    const { status, tableNumber } = req.query;
    
    const where: any = {};
    
    if (status && typeof status === 'string') {
      where.status = status;
    }
    
    if (tableNumber) {
      where.tableNumber = parseInt(tableNumber as string);
    }

    const orders = await prisma.order.findMany({
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
    }) as Order[];

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true
          }
        },
        table: true
      }
    }) as Order | null;

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
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Create new order
 */
export const createOrder = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const validationResult = createOrderSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    const { tableId, items } = validationResult.data;

    // Check if table exists and is available
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      res.status(400).json({
        success: false,
        error: 'Table not found'
      });
      return;
    }

    // Check if all items exist
    const itemIds = items.map((item: { itemId: string; quantity: number }) => item.itemId);
    const existingItems = await prisma.item.findMany({
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

    // Calculate total price
    let totalPrice = 0;
    for (const orderItem of items) {
      const item = existingItems.find(i => i.id === orderItem.itemId);
      if (item) {
        totalPrice += Number(item.price) * orderItem.quantity;
      }
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        tableId,
        tableNumber: table.number,
        totalPrice,
        items: {
          create: items.map((item: { itemId: string; quantity: number }) => {
            const foundItem = existingItems.find(i => i.id === item.itemId);
            return {
              itemId: item.itemId,
              quantity: item.quantity,
              price: foundItem!.price
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
    }) as Order;

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
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

    const updatedOrder = await prisma.order.update({
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
    }) as Order;

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if ((error as any).code === 'P2025') {
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
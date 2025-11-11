import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export declare const getOrders: (req: Request, res: Response<ApiResponse<any[]>>) => Promise<void>;
export declare const getOrderById: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const createOrder: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map
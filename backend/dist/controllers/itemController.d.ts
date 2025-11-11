import { Request, Response } from 'express';
import { ApiResponse, Item } from '../types';
export declare const getItems: (req: Request, res: Response<ApiResponse<Item[]>>) => Promise<void>;
export declare const getItemById: (req: Request, res: Response<ApiResponse<Item>>) => Promise<void>;
export declare const createItem: (req: Request, res: Response<ApiResponse<Item>>) => Promise<void>;
export declare const updateItem: (req: Request, res: Response<ApiResponse<Item>>) => Promise<void>;
export declare const deleteItem: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
//# sourceMappingURL=itemController.d.ts.map
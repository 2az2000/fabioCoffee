import { Request, Response } from 'express';
import { ApiResponse, Category } from '../types';
export declare const getCategories: (req: Request, res: Response<ApiResponse<Category[]>>) => Promise<void>;
export declare const getCategoryById: (req: Request, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const createCategory: (req: Request, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const updateCategory: (req: Request, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const deleteCategory: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
//# sourceMappingURL=categoryController.d.ts.map
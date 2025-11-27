import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const createItemSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodNumber;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    isWeighted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    pricingBaseGrams: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    price: number;
    isWeighted: boolean;
    categoryId: string;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    pricingBaseGrams?: number | undefined;
}, {
    name: string;
    price: number;
    categoryId: string;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
}>, {
    name: string;
    isActive: boolean;
    price: number;
    isWeighted: boolean;
    categoryId: string;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    pricingBaseGrams?: number | undefined;
}, {
    name: string;
    price: number;
    categoryId: string;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
}>;
export declare const updateItemSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    price: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    isWeighted: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    pricingBaseGrams: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
    categoryId?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
    categoryId?: string | undefined;
}>, {
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
    categoryId?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    imageUrl?: string | null | undefined;
    isWeighted?: boolean | undefined;
    pricingBaseGrams?: number | undefined;
    categoryId?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
    limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: string | undefined;
    limit?: string | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const createOrderSchema: z.ZodObject<{
    tableId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        itemId: string;
        quantity: number;
    }, {
        itemId: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    items: {
        itemId: string;
        quantity: number;
    }[];
}, {
    tableId: string;
    items: {
        itemId: string;
        quantity: number;
    }[];
}>;
//# sourceMappingURL=validation.d.ts.map
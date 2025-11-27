"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.idParamSchema = exports.paginationSchema = exports.loginSchema = exports.updateItemSchema = exports.createItemSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Category name is required")
        .max(100, "Category name must be less than 100 characters"),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
const itemSchemaFields = {
    name: zod_1.z
        .string()
        .min(1, "Item name is required")
        .max(100, "Item name must be less than 100 characters"),
    description: zod_1.z.string().nullable().optional(),
    price: zod_1.z
        .number()
        .positive("Price must be positive")
        .max(1000000, "Price must be less than 1000000"),
    imageUrl: zod_1.z
        .string()
        .url("Must be a valid URL")
        .nullable()
        .optional()
        .or(zod_1.z.literal("")),
    isActive: zod_1.z.boolean().optional().default(true),
    isWeighted: zod_1.z.boolean().optional().default(false),
    pricingBaseGrams: zod_1.z
        .number()
        .int()
        .positive("Base grams must be positive")
        .optional(),
    categoryId: zod_1.z.string().min(1, "Category ID is required"),
};
const baseItemSchema = zod_1.z.object(itemSchemaFields);
exports.createItemSchema = baseItemSchema.superRefine((data, ctx) => {
    if (data.isWeighted) {
        if (!data.pricingBaseGrams) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "pricingBaseGrams is required when isWeighted is true",
                path: ["pricingBaseGrams"],
            });
        }
    }
});
exports.updateItemSchema = baseItemSchema
    .partial()
    .superRefine((data, ctx) => {
    if (data.isWeighted === true && data.pricingBaseGrams === undefined) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "pricingBaseGrams is required when isWeighted is true",
            path: ["pricingBaseGrams"],
        });
    }
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Must be a valid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
});
exports.createOrderSchema = zod_1.z.object({
    tableId: zod_1.z.string().min(1, "Table ID is required"),
    items: zod_1.z
        .array(zod_1.z.object({
        itemId: zod_1.z.string().min(1, "Item ID is required"),
        quantity: zod_1.z
            .number()
            .int()
            .positive("Quantity must be positive")
            .max(100, "Quantity must be 100 or less"),
    }))
        .min(1, "At least one item is required"),
});
//# sourceMappingURL=validation.js.map
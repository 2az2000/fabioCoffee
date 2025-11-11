"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.errors.map(error => ({
                field: error.path.join('.'),
                message: error.message
            }))
        });
        return;
    }
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
        return;
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token expired'
        });
        return;
    }
    if (err.code === 'P2002') {
        res.status(409).json({
            success: false,
            error: 'Resource already exists'
        });
        return;
    }
    if (err.code === 'P2025') {
        res.status(404).json({
            success: false,
            error: 'Resource not found'
        });
        return;
    }
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map
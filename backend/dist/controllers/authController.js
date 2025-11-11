"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("../prisma/client");
const auth_1 = require("../utils/auth");
const validation_1 = require("../utils/validation");
const login = async (req, res) => {
    try {
        const validationResult = validation_1.loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
            return;
        }
        const { email, password } = validationResult.data;
        const admin = await client_1.prisma.admin.findUnique({
            where: { email }
        });
        if (!admin) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            return;
        }
        const isValidPassword = await (0, auth_1.comparePassword)(password, admin.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            return;
        }
        const token = (0, auth_1.generateToken)({
            id: admin.id,
            email: admin.email
        });
        res.json({
            success: true,
            data: {
                token,
                admin: {
                    id: admin.id,
                    email: admin.email
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map
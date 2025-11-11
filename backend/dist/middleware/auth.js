"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token required'
        });
        return;
    }
    try {
        const decoded = (0, auth_1.verifyToken)(token);
        req.admin = {
            id: decoded.id,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map
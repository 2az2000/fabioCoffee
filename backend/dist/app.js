"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const categories_1 = __importDefault(require("./routes/categories"));
const items_1 = __importDefault(require("./routes/items"));
const orders_1 = __importDefault(require("./routes/orders"));
const tables_1 = __importDefault(require("./routes/tables"));
const error_1 = require("./middleware/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fabio Cafe API',
            version: '1.0.0',
            description: 'API for Fabio Cafe Management System',
            contact: {
                name: 'Fabio Cafe',
                email: 'info@fabiocafe.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'public', 'uploads')));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Fabio Cafe API is running',
        timestamp: new Date().toISOString()
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use('/api/auth', auth_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/items', items_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/tables', tables_1.default);
app.use(error_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map
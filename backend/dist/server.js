"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const client_1 = require("./prisma/client");
const PORT = process.env.PORT || 3001;
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await client_1.prisma.$disconnect();
    process.exit(0);
});
app_1.default.listen(PORT, () => {
    console.log(`🚀 Fabio Cafe API Server is running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});
//# sourceMappingURL=server.js.map
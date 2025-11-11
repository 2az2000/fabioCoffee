"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableById = exports.getTables = void 0;
const client_1 = require("../prisma/client");
const getTables = async (req, res) => {
    try {
        const tables = await client_1.prisma.table.findMany({
            orderBy: { number: 'asc' }
        });
        res.json({
            success: true,
            data: tables
        });
    }
    catch (error) {
        console.error('Get tables error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getTables = getTables;
const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Table ID is required'
            });
            return;
        }
        const table = await client_1.prisma.table.findUnique({
            where: { id },
            include: {
                orders: {
                    where: {
                        status: {
                            in: ['PENDING', 'PREPARING', 'READY']
                        }
                    },
                    include: {
                        items: {
                            include: {
                                item: true
                            }
                        }
                    }
                }
            }
        });
        if (!table) {
            res.status(404).json({
                success: false,
                error: 'Table not found'
            });
            return;
        }
        res.json({
            success: true,
            data: table
        });
    }
    catch (error) {
        console.error('Get table error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getTableById = getTableById;
//# sourceMappingURL=tableController.js.map
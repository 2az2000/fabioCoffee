import { Router } from 'express';
import { getTables, getTableById } from '../controllers/tableController';

const router = Router();

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of tables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       number:
 *                         type: integer
 *                       capacity:
 *                         type: integer
 */
router.get('/', getTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Get table by ID with active orders
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table details with active orders
 *       404:
 *         description: Table not found
 */
router.get('/:id', getTableById);

export default router;
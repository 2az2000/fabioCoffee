// این فایل مسیرهای (Routes) مربوط به مدیریت میزها (Tables) را تعریف می‌کند.

import { Router } from 'express';
import { getTables, getTableById } from '../controllers/tableController'; // کنترلرهای میز

const router = Router();

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: دریافت تمام میزها
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: لیست میزها
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
 *     summary: دریافت میز بر اساس شناسه به همراه سفارشات فعال
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جزئیات میز به همراه سفارشات فعال (PENDING, PREPARING, READY)
 *       404:
 *         description: میز پیدا نشد
 */
router.get('/:id', getTableById);

export default router;
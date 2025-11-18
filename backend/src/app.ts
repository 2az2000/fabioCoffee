// این فایل پیکربندی اصلی برنامه Express.js را انجام می‌دهد.
// وظیفه آن تنظیم میان‌افزارها، تعریف مسیرهای API و مدیریت مستندات Swagger است.

import express, { Application } from 'express';
import cors from 'cors'; // برای فعال‌سازی CORS (اشتراک منابع بین مبدأها)
import helmet from 'helmet'; // برای افزایش امنیت با تنظیم هدرهای HTTP
import morgan from 'morgan'; // برای لاگ‌گیری درخواست‌های HTTP
import swaggerJsdoc from 'swagger-jsdoc'; // برای تولید مستندات Swagger از کامنت‌های JSDoc
import swaggerUi from 'swagger-ui-express'; // برای نمایش رابط کاربری Swagger
import dotenv from 'dotenv'; // برای بارگذاری متغیرهای محیطی

// وارد کردن مسیرهای (Routes) مختلف برنامه
import authRoutes from './routes/auth'; // مسیرهای احراز هویت (ورود مدیر)
import categoryRoutes from './routes/categories'; // مسیرهای مدیریت دسته‌بندی‌ها
import itemRoutes from './routes/items'; // مسیرهای مدیریت آیتم‌های منو
import orderRoutes from './routes/orders'; // مسیرهای مدیریت سفارشات
import tableRoutes from './routes/tables'; // مسیرهای مدیریت میزها

// وارد کردن میان‌افزار مدیریت خطا
import { errorHandler } from './middleware/error';

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

const app: Application = express();

// پیکربندی Swagger برای تولید مستندات API
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
        bearerAuth: { // تعریف طرح امنیتی JWT Bearer
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // مسیر فایل‌هایی که شامل کامنت‌های Swagger هستند
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// میان‌افزارهای اصلی (Core Middleware)
app.use(helmet()); // تنظیم هدرهای امنیتی
app.use(cors()); // فعال‌سازی CORS
app.use(morgan('combined')); // لاگ‌گیری درخواست‌ها
app.use(express.json({ limit: '10mb' })); // تجزیه بدنه درخواست‌های JSON
app.use(express.urlencoded({ extended: true })); // تجزیه داده‌های URL-encoded

// نقطه پایانی بررسی سلامت (Health check endpoint)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Fabio Cafe API is running',
    timestamp: new Date().toISOString()
  });
});

// مستندات API (در مسیر /api-docs قابل دسترسی است)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// تعریف مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// میان‌افزار مدیریت خطا (باید آخرین میان‌افزار تعریف شده باشد)
app.use(errorHandler);

// مدیریت مسیرهای ناموجود (404 handler)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;
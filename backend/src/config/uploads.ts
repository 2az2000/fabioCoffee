import fs from 'fs';
import path from 'path';

/**
 * نقطه‌ی ریشه پروژه بک‌اند (دو لایه بالاتر از این فایل).
 * استفاده از این نقطه باعث می‌شود چه در اجرا از روی TypeScript (src)
 * و چه پس از ترنسپایل به dist، مسیرها ثابت بمانند.
 */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * مسیر پوشه‌ی آپلودها که باید برای سرو فایل‌های استاتیک استفاده شود.
 * این مسیر در زمان اجرا نیز تضمین می‌شود که وجود داشته باشد.
 */
export const UPLOADS_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');

// اطمینان از وجود پوشه‌ی آپلودها (ایجاد در صورت عدم وجود)
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * بر اساس متغیر محیطی APP_URL (در صورت تعریف) یا درخواست جاری،
 * آدرس مطلق فایل آپلود شده را تولید می‌کند.
 */
export const buildUploadUrl = (reqHost: string, reqProtocol: string, filename: string): string => {
  const baseUrl = process.env.APP_URL || `${reqProtocol}://${reqHost}`;
  return `${baseUrl.replace(/\/+$/, '')}/uploads/${filename}`;
};


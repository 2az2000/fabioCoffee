"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const uploadDir = path_1.default.join(__dirname, '..', 'public', 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage });
router.get('/', itemController_1.getItems);
router.get('/:id', itemController_1.getItemById);
router.post('/', auth_1.authenticateToken, itemController_1.createItem);
router.put('/:id', auth_1.authenticateToken, itemController_1.updateItem);
router.delete('/:id', auth_1.authenticateToken, itemController_1.deleteItem);
router.post('/upload', auth_1.authenticateToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, error: 'File is required' });
            return;
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const url = `${baseUrl}/uploads/${req.file.filename}`;
        res.status(201).json({ success: true, data: { url }, message: 'Image uploaded' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=items.js.map
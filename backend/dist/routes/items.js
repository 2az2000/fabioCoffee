"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', itemController_1.getItems);
router.get('/:id', itemController_1.getItemById);
router.post('/', auth_1.authenticateToken, itemController_1.createItem);
router.put('/:id', auth_1.authenticateToken, itemController_1.updateItem);
router.delete('/:id', auth_1.authenticateToken, itemController_1.deleteItem);
exports.default = router;
//# sourceMappingURL=items.js.map
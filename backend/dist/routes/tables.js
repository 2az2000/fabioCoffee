"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tableController_1 = require("../controllers/tableController");
const router = (0, express_1.Router)();
router.get('/', tableController_1.getTables);
router.get('/:id', tableController_1.getTableById);
exports.default = router;
//# sourceMappingURL=tables.js.map
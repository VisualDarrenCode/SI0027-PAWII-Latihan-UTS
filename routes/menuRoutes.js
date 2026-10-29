const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");

// C1: Daftarkan kelima route
router.get("/", menuController.getAllMenu);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

module.exports = router;
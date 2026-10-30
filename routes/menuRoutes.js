const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Route untuk /menu
router.route('/')
  .get(menuController.getAll)
  .post(menuController.create);

// Route untuk /menu/:id
router.route('/:id')
  .get(menuController.getById)
  .put(menuController.update)
  .delete(menuController.remove);

module.exports = router;
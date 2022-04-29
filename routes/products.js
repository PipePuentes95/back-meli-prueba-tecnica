const express = require("express");
const router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/items', itemsController.getSearch);
router.get('/items/:id', itemsController.getItem);

module.exports = router;
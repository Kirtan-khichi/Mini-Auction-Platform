const express = require('express');
const { createItem, getAllItems } = require('../controllers/itemController');
const router = express.Router();

router.post('/items', createItem);
router.get('/items', getAllItems);

module.exports = router;

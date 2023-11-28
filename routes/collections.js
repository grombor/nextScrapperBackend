const express = require('express');
const router = express.Router();
const collectionsController = require('./collectionsController');

// Create scrap
router.post('/add', collectionsController.addCollection);

module.exports = router;
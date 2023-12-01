const express = require('express');
const router = express.Router();
const resultsController = require('./resultsController');

// Create scrap
router.post('/add', resultsController.addResult);

module.exports = router;
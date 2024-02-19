const express = require('express');
const router = express.Router();
const resultsController = require('./resultsController');

// Create scrap
router.post('/add', resultsController.addResult);

// Get results
router.post('/get', resultsController.getResult);


module.exports = router;
const express = require('express');
const router = express.Router();
const resultsController = require('./resultsController');

// Create scrap
router.post('/add', resultsController.addResult);

// Get results
router.get('/get', resultsController.getResult);
router.post('/post', resultsController.postResult);


module.exports = router;
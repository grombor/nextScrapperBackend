const express = require('express');
const router = express.Router();
const filesController = require('./filesController');

// Get scrap by id
router.get('/:id', filesController.getCsvFileById);

module.exports = router;
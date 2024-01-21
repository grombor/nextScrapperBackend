const express = require('express');
const router = express.Router();
const scrapController = require('./scrapsController');

// Create scrap
router.post('/add', scrapController.addScrap);

// Get all scraps
router.get('/all', scrapController.getAllScraps);

// Get scrap by id
router.get('/:id', scrapController.getScrapById);

// Edit scrap by id
router.put('/:id', scrapController.editScrapById)

// Delete scrap by id
router.delete('/:id', scrapController.deleteScrapById)

// Scrap data from array of ids
router.post('/', scrapController.handleScrapByArray)

module.exports = router;

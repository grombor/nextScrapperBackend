const express = require('express');
const router = express.Router();
const scrapController = require('./scrapsController');
const cors = require('cors');

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'POST', // Dozwolone metody HTTP
};

// Create scrap
router.post('/add', scrapController.addScrap);

// Create scrap
router.get('/all', scrapController.getAllScraps);

// Get scrap by id
router.get('/:id', scrapController.getScrapById);

// Edit scrap by id
router.put('/:id', scrapController.editScrap)

module.exports = router;

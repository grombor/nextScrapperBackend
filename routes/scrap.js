const express = require('express');
const router = express.Router();
const scrapController = require('./scrapController');
const cors = require('cors');

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'POST', // Dozwolone metody HTTP
};

router.post('/api/scrap-add', cors(corsOptions), scrapController.addScrap);

module.exports = router;

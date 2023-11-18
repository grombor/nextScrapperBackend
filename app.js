const express = require('express');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'GET,POST,DELETE,PUT', // Dozwolone metody HTTP
};

app.use(cors(corsOptions));

// Middleware do obsługi JSON
app.use(express.json());

// Importowanie scrapRoutes.js
const scrapRoutes = require('./routes/scraps');

app.use('/scraps', scrapRoutes)

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

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
const scrapList = require('./routes/scrap/scrapList');

// Endpoint dla pobierania listy Scrapów (GET)
app.get('/api/scrap-list', scrapList);

// Importowanie scrapRoutes.js
const scrapData = require('./routes/scrap/scrapData');

// Endpoint dla pobierania listy Scrapów (POST)
app.post('/api/scrap-data', scrapData);

// Importowanie scrapRoutes.js
const scrapAdd = require('./routes/scrap/scrapAdd');

// Endpoint dla dodawania Scrapa (POST)
app.post('/api/scrap-add', scrapAdd);

// Importowanie scrapRoutes.js
const scrapDelete = require('./routes/scrap/scrapDelete');

// Endpoint dla usuwania Scrapa po ID (DELETE)
app.delete('/api/scrap/:id', scrapDelete);

// Importowanie scrapRoutes.js
const scrapEdit = require('./routes/scrap/scrapEdit');

// Endpoint dla edytowania Scrapa po ID (DELETE)
app.put('/api/scrap/:id', scrapEdit);

// Importowanie scrapRoutes.js
const scrapGet = require('./routes/scrap/scrapGet');

// Endpoint dla pobierania Scrapa po ID (GET)
app.get('/api/scrap/:id', scrapGet);

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

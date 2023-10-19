const express = require('express');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'GET,POST,DELETE', // Dozwolone metody HTTP
};

app.use(cors(corsOptions));


// Middleware do obsługi JSON
app.use(express.json()); 


// Importowanie scrapRoutes.js
const scrapList = require('./routes/scrapList')

// Endpoint dla pobierania listy Scrapów (GET)
app.get('/api/scrap-list', scrapList );


// Endpoint dla pobierania Scrapa po ID (GET)
app.get('/api/scrap/:id', (req, res) => {
  console.log('it works');
  res.send('it works');
});

// Importowanie scrapRoutes.js
const scrapAdd = require('./routes/scrapAdd')

// Endpoint dla dodawania Scrapa (POST)
app.post('/api/scrap-add', scrapAdd);

// Endpoint dla usuwania Scrapa po ID (DELETE)
app.delete('/api/scrap/:id', (req, res) => {
  console.log('it works');
  res.send('it works');
});

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

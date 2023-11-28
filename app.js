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

// Middleware do obsługi CORS
app.use(cors(corsOptions));

// Middleware do obsługi JSON
app.use(express.json());

const scrapsRoutes = require('./routes/scraps');
app.use('/api/scraps', scrapsRoutes)

const collectionsRoutes = require('./routes/collections');
app.use('/api/collections', collectionsRoutes)

const filesRoutes = require('./routes/files');
app.use('/api/files', filesRoutes)

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

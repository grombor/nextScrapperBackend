const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const port = process.env.PORT || 8080;

const app = express();

// Użyj middleware CORS
const corsOptions = {
  // Adres domeny frontendu
  // origin: 'http://localhost:3000', 
  
  // Debug
  // Zezwól na dostęp ze wszystkich adresów IP
  origin: '*', 
  methods: 'GET,POST,DELETE,PUT', // Dozwolone metody HTTP
};

// Middleware do obsługi CORS
app.use(cors(corsOptions));

// Middleware do obsługi JSON
app.use(express.json());

// Inicjalizuj klienta Prisma po zakończeniu generowania
const prisma = new PrismaClient();

// Dodaj obsługę ścieżki '/'
app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World</h1>');
});


const scrapsRoutes = require('./routes/scraps');
app.use('/api/scraps', scrapsRoutes)

const resultsRoutes = require('./routes/results');
app.use('/api/results', resultsRoutes)

const filesRoutes = require('./routes/files');
app.use('/api/files', filesRoutes)

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

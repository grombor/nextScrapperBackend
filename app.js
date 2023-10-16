const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

// Użyj middleware CORS
app.use(cors());

app.use(express.json()); // Middleware do obsługi JSON

const prisma = new PrismaClient();

// Endpoint dla pobierania listy Scrapów (GET)
app.get('/api/scrap-list', async (req, res) => {
  try {
    const scraps = await prisma.scrap.findMany({
      include: {
        selectors: true,
      },
    });

    if (scraps.length === 0) {
      return res.status(404).json({ message: 'No entries found in the database.' });
    }

    res.json({ data: scraps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint dla pobierania Scrapa po ID (GET)
app.get('/api/scrap/:id', (req, res) => {
  console.log('it works');
  res.send('it works');
});

// Endpoint dla dodawania Scrapa (POST)
app.post('/api/scrap', (req, res) => {
  console.log('it works');
  res.send('it works');
});

// Endpoint dla usuwania Scrapa po ID (DELETE)
app.delete('/api/scrap/:id', (req, res) => {
  console.log('it works');
  res.send('it works');
});

app.listen(port, () => {
  console.log(`Aplikacja jest uruchomiona na porcie ${port}`);
});

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const router = express.Router();
const axios = require('axios'); // Import Axios
const cheerio = require('cheerio'); // Import Cheerio

const prisma = new PrismaClient();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'POST', // Dozwolone metody HTTP
};

async function scrapFromArray(scraps) {
  let results = [];

  await Promise.all(
    scraps.map(async (scrap) => {
      try {
        const url = scrap.url;
        const selectors = scrap.selectors;
        // Wywołaj funkcję scrapującą
        const scrapedData = await doScraping(url, selectors);
        results.push(scrapedData);
      } catch (error) {
        console.error(`Błąd podczas scrapowania ${url}: ${error.message}`);
        return { error: `Błąd podczas scrapowania ${url}: ${error.message}` };
      }
    })
  );

  // Zwróc ścrapy z zaktualizowanymi wartościami
  return results;
}

async function doScraping(url, selectors) {
  // Tutaj zdefiniuj kod do scrapowania
  // np. używając bibliotek takich jak Axios i Cheerio

  // Przykładowy kod scrapowania
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  // Użyj selektorów do scrapowania danych
  const title = $(selectors.title).text();
  const description = $(selectors.description).text();

  // Przygotuj wynik scrapowania
  const scrapedData = {
    title,
    description,
  };

  return scrapedData;
}

router.post('/api/scrap-data', cors(corsOptions), async (req, res) => {
  const ids = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      error: 'No valid data provided.',
    });
  }

  try {
    const scraps = await prisma.scrap.findMany({
      where: {
        id: {
          in: ids, // Znajdź obiekty o ID z przesłanej tablicy
        },
      },
      include: {
        selectors: true,
      },
    });

    if (scraps.length === 0) {
      return res.status(404).json({ message: 'No entries found in the database.' });
    }

    const results = await scrapFromArray(scraps);
    res.status(200).json({ data: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

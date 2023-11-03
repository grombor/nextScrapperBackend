const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const router = express.Router();
const axios = require('axios'); // Import Axios
const cheerio = require('cheerio'); // Import Cheerio

const makeCsv = require('../helpers/makeCsv');

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
        const scrapedData = await doScraping(scrap);
        results.push(scrapedData);
      } catch (error) {
        console.error(
          `Błąd podczas scrapowania ${scrap.url}: ${error.message}`
        );
        return {
          error: `Błąd podczas scrapowania ${scrap.url}: ${error.message}`,
        };
      }
    })
  );

  return results;
}

async function doScraping(scrap) {
  const url = scrap.url;
  const selectors = scrap.selectors;

  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  let updatedSelectors = [];

  selectors.forEach((selector) => {
    let updatedSelector = {
      ...selector,
      value: $(selector.selector).text().replace(/\s+/g, ' ').trim(),
    };

    updatedSelectors.push(updatedSelector);
  });

  // Scrap results
  let scrapResults = {
    ...scrap,
    selectors: updatedSelectors,
  };

  return scrapResults;
}

async function saveToFile(results) {
  results?.map(result => {
    makeCsv(result);
  })
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
          in: ids,
        },
      },
      include: {
        selectors: true,
      },
    });

    if (scraps.length === 0) {
      return res
        .status(404)
        .json({ message: 'No entries found in the database.' });
    }

    const results = await scrapFromArray(scraps);

    await saveToFile(results);

    res.status(200).json({ data: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

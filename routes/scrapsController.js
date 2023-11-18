const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios'); // Import Axios
const cheerio = require('cheerio'); // Import Cheerio
const makeCsv = require('../helpers/makeCsv');

async function addScrap(req, res) {
  try {
    const { name, author = 'admin', url, selectors } = req.body;

    if (!Array.isArray(selectors)) {
      return res.status(400).json({
        error: 'Invalid or missing array of selectors.',
      });
    }

    const currentDate = new Date().toISOString();

    const newScrap = await prisma.scrap.create({
      data: {
        name,
        createdDate: currentDate,
        lastModifiedDate: currentDate,
        author,
        url,
        selectors,
      },
    });

    return res.status(201).json({
      data: newScrap,
      message: 'Object created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

async function getScrapById(req, res) {
  const id = req.params.id;

  try {
    const existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    return res.status(200).json({
      data: existingScrap,
      message: 'ok',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

async function getAllScraps(req, res) {
  try {
    const scraps = await prisma.scrap.findMany();

    if (scraps.length === 0) {
      return res.status(404).json({ message: 'No entries found in the database.' });
    }

    res.json({ data: scraps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function editScrapById(req, res) {
  const id = req.params.id; // Pobierz identyfikator scrapu do edycji z URL

  try {
    // Sprawdź, czy scrap istnieje
    let existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    // Odczytaj dane z ciała zapytania PUT
    const newDataFromPUT = req.body; // Nowe dane z PUT

    // Budujemy strukturę danych, aby uniknąć błędu dotyczącego pola selectors
    const updatedSelectors = newDataFromPUT.selectors || existingScrap.selectors;

    // Aktualizuj obiekt Scrap używając danych z zapytania PUT
    const updatedScrap = await prisma.scrap.update({
      where: {
        id: id,
      },
      data: {
        name: newDataFromPUT.name || existingScrap.name,
        createdDate: newDataFromPUT.createdDate || existingScrap.createdDate,
        lastModifiedDate: new Date().toISOString(), // Aktualna data w formacie ISO
        author: newDataFromPUT.author || existingScrap.author,
        url: newDataFromPUT.url || existingScrap.url,
        selectors: [...updatedSelectors]
      },
    });

    // Zwróć zaktualizowany obiekt
    return res.status(200).json({ 
      data: updatedScrap,
      message: 'ok'
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

async function deleteScrapById(req, res) {
  const id = req.params.id; // Pobierz identyfikator scrapu do usunięcia z url

  try {
    // Sprawdź, czy scrap istnieje
    const existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    // Usuń scrap z bazy danych
    await prisma.scrap.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ 
      data: id,
      message: 'Scrap deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

async function scrapFromArray(scraps) {
  let results = [];

  await Promise.all(
    scraps.map(async (scrap) => {
      try {
        const scrapedData = await doScraping(scrap);
        results.push(scrapedData);
      } catch (error) {
        console.error(
          `Error during scraping ${scrap.url}: ${error.message}`
        );
        return {
          error: `Error during scraping ${scrap.url}: ${error.message}`,
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
    if (selector.selector === '' && selector.value !== '') {
      updatedSelectors.push({
        name: selector.name,
        selector: '',
        value: selector.value,
      });
    } else {
    let updatedSelector = {
      ...selector,
      value: $(selector.selector).text().replace(/\s+/g, ' ').trim(),
    };

    updatedSelectors.push(updatedSelector)};
  });

  // Scrap results
  let scrapResults = {
    ...scrap,
    selectors: updatedSelectors,
  };

  return scrapResults;
}

async function saveToFile(results) {
  results?.map((result) => {
    makeCsv(result);
  });
}

async function handleScrapByArray(req, res) {
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
    });

    if (scraps.length === 0) {
      return res
        .status(404)
        .json({ message: 'No entries found in the database.' });
    }

    const results = await scrapFromArray(scraps);

    await saveToFile(results);

    res.status(200).json({ 
      data: results,
      message: "ok"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { addScrap, getScrapById, getAllScraps, editScrapById, deleteScrapById, handleScrapByArray };

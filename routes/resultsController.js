const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addResult(req, res) {
  try {
    const { scrap } = req.body;

    const newCollection = await prisma.results.create({
      data: scrap,
    });

    return res.status(200).json({
      message: 'Scrap result added successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Failed to add scrap result. Please try again.',
    });
  }
}

async function getResult(req, res) {
  try {
    const { url, author, id, name } = req.body;

    // Pobierz ostatni (najnowszy) wpis dla danego konta
    const latestResults = await prisma.scrapResults.findMany({
      where: { name: name },
      take: -1,
    });

    if (latestResults.length > 0) {
      const [data] = latestResults;

      return res.status(200).json({
        latestResults
      });
    } else {
      return res.status(404).json({
        error: 'No results found for the provided URL.',
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Failed to return scrap result. Please try again.',
    });
  }
}

module.exports = { addResult, getResult };


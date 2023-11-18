const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = { addScrap, getScrapById, getAllScraps };

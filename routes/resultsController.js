const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addResult(req, res) {
  try {
    const { scrap } = req.body;

    // Utwórz nową kolekcję za pomocą Prisma
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

module.exports = { addResult };

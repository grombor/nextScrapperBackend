const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCollection(req, res) {
  try {
    const { name } = req.body;

    // Utwórz nową kolekcję za pomocą Prisma
    const newCollection = await prisma.collections.create({
      data: {
        name,
      },
    });

    return res.status(200).json({
      message: 'Collection added successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Failed to add collection. Please try again.',
    });
  }
}

module.exports = { addCollection };

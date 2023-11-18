const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addScrap(req, res) {
  try {
    const {
      name,
      author = 'admin',
      url,
      selectors,
    } = req.body;

    if (!Array.isArray(selectors)) {
      return res.status(400).json({
        error: 'Invalid or missing array of selectors.',
      });
    }

    const currentDate = new Date().toISOString()

    const newScrap = await prisma.scrap.create({
      data: {
        name,
        createdDate: currentDate,
        lastModifiedDate: currentDate,
        author,
        url,
        selectors
      },
    });

    return res.status(201).json({
      data: newScrap,
      message: 'Object created successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { addScrap };

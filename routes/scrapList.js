const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/api/scrap-list', async (req, res) => {
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

module.exports = router;

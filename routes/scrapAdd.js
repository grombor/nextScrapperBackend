const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/api/scrap-add', async (req, res) => {
  try {
    const {
      name,
      createdDate = new Date().toISOString(),
      lastModifiedDate = new Date().toISOString(),
      isChecked = false,
      author = 'admin',
      url,
      selectors,
    } = req.body;

    if (!Array.isArray(selectors)) {
      return res.status(400).json({
        error: 'Invalid or missing array of selectors.',
      });
    }

    const newSelectors = selectors.map((selector) => ({
      ...selector,
      value: selector.value || '',
    }));

    const newScrap = await prisma.scrap.create({
      data: {
        name,
        createdDate: new Date(createdDate),
        lastModifiedDate: new Date(lastModifiedDate),
        isChecked,
        author,
        url,
        selectors: {
          create: newSelectors,
        },
      },
    });

    return res.status(201).json({
      data: newScrap,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

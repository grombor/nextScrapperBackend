const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const cors = require('cors');
const prisma = new PrismaClient();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'GET', // Dozwolona metoda HTTP
};

router.get('/api/scrap/:id', cors(corsOptions), async (req, res) => {
  const id = req.params.id; // Pobierz identyfikator scrapu do edycji z url

  try {
    // Sprawdź, czy scrap istnieje
    const existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
      // include: {
      //   selectors: true,
      // },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    // Zwróc obiekt ktory odpowiada  podanemu id
    return res.status(200).json(existingScrap);
    // return res.status(200).json({ message: existingScrap });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

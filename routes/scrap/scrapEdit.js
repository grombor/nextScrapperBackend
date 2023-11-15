const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const cors = require('cors');
const prisma = new PrismaClient();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'PUT', // Dozwolona metoda HTTP
};

router.put('/api/scrap/:id', cors(corsOptions), async (req, res) => {
  const id = req.params.id; // Pobierz identyfikator scrapu do edycji z URL

  try {
    // Sprawdź, czy scrap istnieje
    let existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
      include: {
        selectors: true,
      },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    // Odczytaj dane z ciała zapytania PUT
    const newDataFromPUT = req.body; // Nowe dane z PUT

    // Aktualizuj obiekt Scrap używając danych z zapytania PUT
    for (const key in newDataFromPUT) {
      if (newDataFromPUT[key] !== '') {
        existingScrap = {
          ...existingScrap,
          [key]: newDataFromPUT[key],
        };
      }
    }

    // Zaktualizuj Scrap w bazie danych
    const updatedScrap = await prisma.scrap.update({
      where: {
        id: id,
      },
      data: existingScrap,
    });

    // Zwróć zaktualizowany obiekt
    return res.status(200).json({ message: updatedScrap });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});


module.exports = router;

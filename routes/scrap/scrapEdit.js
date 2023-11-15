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
        isChecked: newDataFromPUT.isChecked !== undefined ? newDataFromPUT.isChecked : existingScrap.isChecked,
        author: newDataFromPUT.author || existingScrap.author,
        url: newDataFromPUT.url || existingScrap.url,
        selectors: [...updatedSelectors]
      },
    });

    // Zwróć zaktualizowany obiekt
    return res.status(200).json(updatedSelectors);
    // return res.status(200).json({ message: updatedSelectors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});


module.exports = router;

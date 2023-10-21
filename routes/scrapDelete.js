const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const cors = require('cors');
const prisma = new PrismaClient();

// Użyj middleware CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Adres domeny frontendu
  methods: 'DELETE', // Dozwolona metoda HTTP: DELETE
};

router.delete('/api/scrap/:id', cors(corsOptions), async (req, res) => {
  const id = req.params.id; // Pobierz identyfikator scrapu do usunięcia

  // debug
//   console.log(scrapId)
//   return res.status(200)
// })

  try {
    // Sprawdź, czy scrap istnieje
    const existingScrap = await prisma.scrap.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    // Usuń scrap z bazy danych
    await prisma.scrap.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ message: 'Scrap deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

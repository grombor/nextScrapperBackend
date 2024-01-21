const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pushRecord = async (data) => {
  const timeout = 2000;
  const results = JSON.parse(data);

  for (const [index, result] of results.entries()) {
    try {
      console.log(`${index + 1}: Dodaję`, result.name);
      await prisma.ScrapResults.create({
        data: {
          name: result.name,
          createdDate: result.createdDate,
          author: result.author,
          url: result.url,
          selectors: result.selectors,
        },
      });
    } catch (error) {
      console.log(error);
    }
    await new Promise((resolve) => setTimeout(resolve, timeout)); // Opóźnienie przed następnym rekordem
  }
};

fs.readFile('./helpers/results.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error('Błąd odczytu pliku:', err);
    return;
  }

  try {
    await pushRecord(data);
  } catch (error) {
    console.error('Błąd parsowania danych:', error);
  }
});

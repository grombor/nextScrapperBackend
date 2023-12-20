const fs = require('fs');
const csv = require('csv-parser');

const results = [];

const fileName = process.argv[3]; // Pobierz nazwę pliku z argumentów wiersza poleceń

fs.createReadStream(fileName)
  .pipe(csv())
  .on('data', (row) => {
    const scrapResult = {
      name: row.name,
      createdDate: row.createdDate,
      author: row.author ? row.author : 'admin',
      url: row.url ? row.url : row.product_card_link ,
      selectors: [], // Puste pole selectors
    };

    // Iteruj przez klucze obiektu, wykluczając znane klucze
    Object.keys(row).forEach((key) => {
      if (!['name', 'createdDate', 'author', 'url', 'id'].includes(key)) {
        scrapResult.selectors.push({
          name: key,
          selector: '',
          value: row[key],
        });
      }
    });

    results.push(scrapResult);
  })
  .on('end', () => {
    const outputFilePath = 'results.txt'; // Ścieżka do pliku wynikowego

    fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error('Błąd podczas zapisywania pliku:', err);
        return;
      }
      console.log(`Zapisano dane do pliku ${outputFilePath}`);
    });
  });

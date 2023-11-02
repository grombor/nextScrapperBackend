const getCurrentDate = require('./getCurrentDate');

function makeCsv(object) {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  
    const header = [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'createdDate', title: 'createdDate' },
      { id: 'lastModifiedDate', title: 'lastModifiedDate' },
    ];
  
    const selectors = [];
    object.selectors.forEach((selector) => {
      const selectorHeader = {
        id: selector.name,
        title: selector.name
      }
      selectors.push(selectorHeader)
    });
  
      // Przygotuj rekord na podstawie selectors
      const record = {
        id: object.id,
        name: object.name,
        createdDate: object.createdDate,
        lastModifiedDate: object.createdDate,
      };
    
      // Przypisz wartości do rekordu z selectors.value
      object.selectors.forEach((selector) => {
        record[selector.name] = selector.value;
      });
    
      const records = [record];
    
      function sanitizeFileName(name) {
        return name.replace(/[\\/:*?"<>|]/g, ''); // Usuwa niedozwolone znaki
      }
  
      const outputFilePath = `public/results/${object.id}_${sanitizeFileName(object.name)}_${getCurrentDate()}.csv`;
  
    // Tworzenie obiektu CsvWriter
    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [...header, ...selectors],
    });
  
    // Zapisywanie rekordów do pliku CSV
    csvWriter
      .writeRecords(records)
      .then(() => {
        console.log(`Zapisano plik CSV do ${outputFilePath}`);
      })
      .catch((error) => {
        console.error('Błąd podczas zapisywania pliku CSV:', error);
      });
  }

  module.exports = makeCsv;
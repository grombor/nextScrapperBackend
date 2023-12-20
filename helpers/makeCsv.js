const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function makeCsv(object) {
  
    const header = [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'createdDate', title: 'createdDate' },
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
      };
    
      // Przypisz wartości do rekordu z selectors.value
      object.selectors.forEach((selector) => {
        record[selector.name] = selector.value;
      });
    
      const records = [record];
    
      const outputDir = 'public/results';
      const outputFilePath = path.join(outputDir, `${object.id}_${object.name}.csv`);
    
      // Sprawdź, czy plik istnieje
      if (fs.existsSync(outputFilePath)) {
        // Jeśli plik istnieje, odczytaj jego zawartość
        const existingContent = fs.readFileSync(outputFilePath, 'utf8');
        
        // Rozbij zawartość na linie i usuń pustą linię na końcu (jeśli istnieje)
        const lines = existingContent.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        
        if (!lastLine) {
          lines.pop();
        }
        
        // Dodaj nowy rekord do zawartości
        lines.push(recordToCsvLine(record));
        
        // Zapisz zaktualizowaną zawartość do pliku
        fs.writeFileSync(outputFilePath, lines.join('\n'));
      } else {
        // Jeśli plik nie istnieje, utwórz go od nowa
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
    }
    
    // Funkcja zamieniająca rekord na linię CSV
    function recordToCsvLine(record) {
      return Object.values(record).join(',');
    }
    
    module.exports = makeCsv;
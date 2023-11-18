const fs = require('fs');
const path = require('path');

async function getCsvFileById(req, res) {
    const id = req.params.id;

    const directoryPath = './public/results';
  
    try {
      // Sprawdź, czy folder istnieje
      if (!fs.existsSync(directoryPath)) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      // Pobierz listę plików w folderze
      const files = fs.readdirSync(directoryPath);
  
      // Szukaj pliku .csv o zadanej nazwie
      const csvFile = files.find((file) => {
        return file === `${id}.csv`;
      });
  
      // Jeśli plik zostanie znaleziony, wyślij go w odpowiedzi
      if (csvFile) {
        const filePath = path.join(directoryPath, csvFile);
        return res.download(filePath);
      } else {
        return res.status(404).json({ error: 'CSV file not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getCsvFileById };

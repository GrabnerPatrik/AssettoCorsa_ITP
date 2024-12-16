const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Absoluter Pfad zur JSON-Datei (anpassen nach deinem Verzeichnis)
const filePath = 'C:/Users/fbaum/OneDrive/Dokumente/Assetto Corsa/out/race_out.json';  // Ersetze diesen Pfad mit dem tatsächlichen Pfad

// Endpoint zum Bereitstellen der JSON-Daten
app.get('/data', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Fehler beim Laden der Datei');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

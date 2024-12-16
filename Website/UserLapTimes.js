// Funktion zum Parsen der Laps.ini-Datei
function parseLapData(lapData) {
    let lines = lapData.split('\n');
    let laps = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[LAP_')) {
            let lap = {};
            let lapNumber = lines[i].match(/\d+/)[0];
            lap.time = parseInt(lines[i + 1].split('=')[1]);
            lap.splits = [];

            for (let j = 0; j < 3; j++) {
                let splitLine = lines[i + 3 + j];
                if (splitLine) {
                    lap.splits.push(parseInt(splitLine.split('=')[1]));
                }
            }
            laps.push(lap);
        }
    }
    return laps;
}

// Funktion zum Anzeigen der Rundenzeiten in der Tabelle
// Funktion zum Anzeigen der Rundenzeiten in der Tabelle
// Funktion zum Anzeigen der Rundenzeiten in der Tabelle
function displayLapTimes() {
    let laps = JSON.parse(localStorage.getItem('laps')) || [];
    
    // Sortiere die Laps nach der besten Zeit (aufsteigend)
    laps.sort((a, b) => a.time - b.time);  // Schnellerer Fahrer zuerst
    
    let tableBody = document.getElementById("lapsTableBody");
    tableBody.innerHTML = '';  // Tabelle leeren

    laps.forEach((lap, index) => {
        let row = document.createElement('tr');
        
        let positionCell = document.createElement('td');
        positionCell.textContent = index + 1;  // Position nach Reihenfolge
        row.appendChild(positionCell);

        // Hier den Fahrernamen aus der Runde holen
        let driverNameCell = document.createElement('td');
        let driverName = lap.driverName || 'Unbekannt';
        driverNameCell.textContent = driverName;
        row.appendChild(driverNameCell);

        let timeCell = document.createElement('td');
        timeCell.textContent = formatTime(lap.time);  // Gesamtzeit formatieren
        row.appendChild(timeCell);

        // Splits formatieren
        let splitsCell = document.createElement('td');
        let formattedSplits = lap.splits.map(split => formatSplitTime(split)).join(', ');  // Alle Splits formatieren
        splitsCell.textContent = formattedSplits;
        row.appendChild(splitsCell);

        tableBody.appendChild(row);
    });
}


// Funktion zum Formatieren der Splitzeit
function formatSplitTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds}`;
}


// Funktion zum Formatieren der Zeit
function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds}`;
}

// Funktion zum Speichern des Fahrernamens im localStorage
function saveDriverName(name) {
    localStorage.setItem('driverName', name);
}

// Funktion zum Verarbeiten der hochgeladenen Datei
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.ini')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let lapData = e.target.result;
            let laps = parseLapData(lapData);

            // Fahrername vom Benutzer abfragen
            let driverName = prompt("Bitte geben Sie den Fahrernamen ein:");
            if (!driverName) {
                driverName = 'Unbekannt';  // Falls kein Name eingegeben wird, setzen wir 'Unbekannt'
            }

            // Die neuen Laps mit dem Fahrername versehen
            laps = laps.map(lap => ({ ...lap, driverName }));

            // Alte Laps aus dem localStorage holen und neue hinzufügen
            let existingLaps = JSON.parse(localStorage.getItem('laps')) || [];
            existingLaps = existingLaps.concat(laps);  // Neue Runden anhängen

            // Alle Laps im localStorage speichern
            localStorage.setItem('laps', JSON.stringify(existingLaps));

            // Die Anzeige direkt aktualisieren
            displayLapTimes();
        };
        reader.readAsText(file);
    } else {
        alert("Bitte wähle eine gültige .ini-Datei aus.");
    }
}

// Funktion zum Entfernen von Fahrername und Rundenzeiten
function resetAll() {
    // Entfernt den Fahrernamen aus dem localStorage
    localStorage.removeItem('driverName');
    
    // Löscht die Rundenzeiten aus dem localStorage
    localStorage.removeItem('laps');

    // Löscht die Rundenzeiten aus der Tabelle
    let tableBody = document.getElementById("lapsTableBody");
    tableBody.innerHTML = '';

    alert("Alle Daten wurden zurückgesetzt.");
    displayLapTimes();  // Nach dem Zurücksetzen die Tabelle erneut anzeigen
}

// Beim Laden der Seite die Rundenzeiten anzeigen
window.onload = function() {
    displayLapTimes();
};

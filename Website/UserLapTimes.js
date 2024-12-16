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
function displayLapTimes() {
    let laps = JSON.parse(localStorage.getItem('laps')) || [];

    // Sortiere die Laps nach der besten Zeit (aufsteigend)
    laps.sort((a, b) => a.time - b.time);

    let tableBody = document.getElementById("lapsTableBody");
    tableBody.innerHTML = ''; // Tabelle leeren

    laps.forEach((lap, index) => {
        let row = document.createElement('tr');

        let positionCell = document.createElement('td');
        positionCell.textContent = index + 1; // Position nach Reihenfolge
        row.appendChild(positionCell);

        let driverNameCell = document.createElement('td');
        let driverName = lap.driverName || 'Unbekannt';
        driverNameCell.textContent = driverName;
        row.appendChild(driverNameCell);

        let timeCell = document.createElement('td');
        timeCell.textContent = formatTime(lap.time); // Gesamtzeit formatieren
        row.appendChild(timeCell);

        // Splits formatieren
        let splitsCell = document.createElement('td');
        let formattedSplits = lap.splits.map(split => formatTime(split)).join(', '); // Nutze formatTime für Splits
        splitsCell.textContent = formattedSplits;
        row.appendChild(splitsCell);

        tableBody.appendChild(row);
    });
}

// Funktion zum Formatieren der Zeit (Runden- und Split-Zeiten)
function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds}`;
}

// Funktion zum Verarbeiten der hochgeladenen Datei
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.ini')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            let lapData = e.target.result;
            let newLaps = parseLapData(lapData);

            // Fahrername vom Benutzer abfragen
            let driverName = prompt("Bitte geben Sie den Fahrernamen ein:");
            if (!driverName) {
                driverName = 'Unbekannt'; // Falls kein Name eingegeben wird, setzen wir 'Unbekannt'
            }

            // Lade existierende Runden aus dem Speicher
            let existingLaps = JSON.parse(localStorage.getItem('laps')) || [];

            // Aktualisiere die beste Zeit für den Fahrer
            newLaps.forEach(newLap => {
                newLap.driverName = driverName;

                // Überprüfe, ob Fahrer bereits in den bestehenden Daten ist
                let existingLap = existingLaps.find(lap => lap.driverName === driverName);

                if (!existingLap || newLap.time < existingLap.time) {
                    // Ersetze bestehende Runde, wenn die neue schneller ist oder noch keine existiert
                    existingLaps = existingLaps.filter(lap => lap.driverName !== driverName);
                    existingLaps.push(newLap);
                }
            });

            // Speicher aktualisierte Laps im localStorage
            localStorage.setItem('laps', JSON.stringify(existingLaps));

            // Die Anzeige direkt aktualisieren
            displayLapTimes();
        };
        reader.readAsText(file);
    } else {
        alert("Bitte wähle eine gültige .ini-Datei aus.");
    }
}

// Funktion zum Zurücksetzen aller Daten
function resetAll() {
    localStorage.removeItem('driverName');
    localStorage.removeItem('laps');
    document.getElementById("lapsTableBody").innerHTML = '';
    alert("Alle Daten wurden zurückgesetzt.");
    displayLapTimes();
}

// Beim Laden der Seite die Rundenzeiten anzeigen
window.onload = function () {
    displayLapTimes();
};

// Erstelle die Karte mit Leaflet.js
var map = L.map('map').setView([0, 0], 13); // Startposition und Zoomlevel

// Karte mit OpenStreetMap Hintergrund
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marker-Array für die Fahrzeuge
var vehicleMarkers = {};

// Helper function to format time in mm:ss:ms
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}

// Fetch and display telemetry data every 5 seconds
async function fetchTelemetryData() {
    try {
        const response = await fetch('http://localhost:5000/telemetry');
        const data = await response.json();
        updateTelemetryTable(data);
        updateCarPositions(data); // Update the car positions on the map
    } catch (error) {
        console.error('Error fetching telemetry data:', error);
    }
}

// Update the telemetry table with fetched data
function updateTelemetryTable(data) {
    const tableBody = document.getElementById('telemetryTable').querySelector('tbody');
    tableBody.innerHTML = '';  // Clear the table

    // Filter out drivers with a BestLapTimeSec of 0 or below, then sort by BestLapTimeSec in ascending order
    const filteredData = data
        .filter(driver => driver.BestLapTimeSec > 0)  // Only include laps above 0
        .sort((a, b) => a.BestLapTimeSec - b.BestLapTimeSec); // Sort by best lap time

    filteredData.forEach((driver, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Position based on sorted order -->
            <td>${driver.DriverName}</td>
            <td>${driver.CarModel || 'N/A'}</td> <!-- Display Car Model if available -->
            <td>${formatTime(driver.BestLapTimeSec)}</td>  <!-- Formatted Best Lap Time -->
        `;
        tableBody.appendChild(row);
    });
}

// Update the vehicle markers on the map
function updateCarPositions(data) {
    data.forEach(driver => {
        // Get the driver's position (x, y)
        const position = driver.Position; // Position is expected to be [x, y, z]
        
        if (position && position.length >= 2) {
            // Check if the marker already exists for this car
            if (vehicleMarkers[driver.CarID]) {
                // Update the existing marker position
                vehicleMarkers[driver.CarID].setLatLng([position[0], position[1]]);
                vehicleMarkers[driver.CarID].getPopup().setContent('<b>' + driver.DriverName + '</b><br>Position: (' + position[0].toFixed(2) + ', ' + position[1].toFixed(2) + ')');
            } else {
                // Add a new marker for the car
                const marker = L.marker([position[0], position[1]]).addTo(map);
                marker.bindPopup('<b>' + driver.DriverName + '</b><br>Position: (' + position[0].toFixed(2) + ', ' + position[1].toFixed(2) + ')');
                vehicleMarkers[driver.CarID] = marker;
            }
        }
    });
}

// Initiales Abrufen der Daten alle 5 Sekunden
setInterval(fetchTelemetryData, 500);
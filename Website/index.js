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

setInterval(fetchTelemetryData, 1000);

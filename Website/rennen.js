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

    // Sort data by LeaderboardPosition in ascending order
    data.sort((a, b) => a.LeaderboardPosition - b.LeaderboardPosition);

    data.forEach(driver => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${driver.LeaderboardPosition}</td>
            <td>${driver.DriverName}</td>
            <!--<td>${driver.CarModel}</td>-->
            <td>${driver.SpeedKmh.toFixed(1)}</td>
            <td>${formatTime(driver.BestLapTimeSec)}</td>  <!-- Formatted Best Lap Time -->
            <td>${driver.LapCount}</td>
            <td>${formatTime(driver.CurrentLapTimeSec)}</td> <!-- Formatted Current Lap Time -->
            <!--<td>${driver.LastLapTimeSec.toFixed(3)}</td>-->
            <td>${driver.InPit ? 'Yes' : 'No'}</td>            
        `;

        tableBody.appendChild(row);
    });
}

// Refresh data every 5 seconds
setInterval(fetchTelemetryData, 1000);

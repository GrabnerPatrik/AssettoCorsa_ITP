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
            <td>${driver.BestLapTimeSec.toFixed(3)}</td>
            <td>${driver.LapCount}</td>
            <td>${driver.CurrentLapTimeSec.toFixed(3)}</td>
            <!--<td>${driver.LastLapTimeSec.toFixed(3)}</td>-->
            <td>${driver.InPit ? 'Yes' : 'No'}</td>            
        `;

        tableBody.appendChild(row);
    });
}

// Refresh data every 5 seconds
setInterval(fetchTelemetryData, 500);

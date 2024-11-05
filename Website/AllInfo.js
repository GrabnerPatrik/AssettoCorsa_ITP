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

    data.forEach(driver => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${driver.CarID}</td>
            <td>${driver.DriverName}</td>
            <td>${driver.CarModel}</td>
            <td>${driver.SpeedKmh.toFixed(1)}</td>
            <td>${driver.BestLapTimeSec.toFixed(3)}</td>
            <td>${driver.LapCount}</td>
            <td>${driver.CurrentLapTimeSec.toFixed(3)}</td>
            <td>${driver.LastLapTimeSec.toFixed(3)}</td>
            <td>(${driver.Position.x.toFixed(2)}, ${driver.Position.y.toFixed(2)}, ${driver.Position.z.toFixed(2)})</td>
            <td>${driver.InPit ? 'Yes' : 'No'}</td>
            <td>${driver.LeaderboardPosition}</td>
            <td>${driver.SuspensionDamage.map(d => d.toFixed(1)).join(', ')}</td>
            <td>${driver.EngineLifeLeft.toFixed(1)}%</td>
            <td>${driver.TyreInflation.map(t => t.toFixed(1)).join(', ')}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Refresh data every 5 seconds
setInterval(fetchTelemetryData, 5000);

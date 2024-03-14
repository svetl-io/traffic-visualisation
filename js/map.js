var map;

document.addEventListener('DOMContentLoaded', (event) => {
    map = L.map("map").setView([42.6742407, 23.3765016], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    trafficLights.init(map);
});

// Simulate receiving data from the backend after initial map load
document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        var trafficLightsData = [
            { "id": 9802528500, "color": "red" },
            { "id": 9802528501, "color": "green" },
            { "id": 9802528502, "color": "red" },
            { "id": 9802528503, "color": "green" }
        ];
        trafficLights.updateTrafficLights(trafficLightsData);
    }, 5000); // Simulate a delay of 5 seconds before receiving the data
});

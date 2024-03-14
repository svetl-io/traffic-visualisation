var map;

var sofiaCenterLat = 42.66296;
var sofiaCenterLon = 23.37570;
var latDelta = 0.090;
var lonDelta = 0.1180;

var bbox = [
    sofiaCenterLat - latDelta, // south latitude
    sofiaCenterLon - lonDelta, // west longitude
    sofiaCenterLat + latDelta, // north latitude
    sofiaCenterLon + lonDelta  // east longitude
];

document.addEventListener('DOMContentLoaded', (event) => {
    var sofiaCenter = [sofiaCenterLat, sofiaCenterLon];
    var initialZoom = 19;

    map = L.map("map", {
        zoom: initialZoom,
        maxZoom: initialZoom,
        center: sofiaCenter,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: initialZoom,
    }).addTo(map);

    trafficLights.init(map);

    var bounds = L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]);
    map.once("zoomend", function() {
        map.fitBounds(bounds, {maxZoom: initialZoom});
    }).setView(sofiaCenter, initialZoom);
});

// Simulate receiving data from the backend after initial map load
document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        var trafficLightsData = [
            { "id": 11642267369, "color": "green" },
            { "id": 11642267370, "color": "green" }
        ];
        trafficLights.updateTrafficLights(trafficLightsData);
    }, 5000); // delay of 5 seconds before receiving the data
});

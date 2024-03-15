let map;

const sofiaCenterLat = 42.66296;
const sofiaCenterLon = 23.3757;
const latDelta = 0.09;
const lonDelta = 0.118;

const trafficLightsArray = [
  { id: 11642267369, color: "green" },
  { id: 11642267370, color: "green" },
];

const bbox = [
  sofiaCenterLat - latDelta, // south latitude
  sofiaCenterLon - lonDelta, // west longitude
  sofiaCenterLat + latDelta, // north latitude
  sofiaCenterLon + lonDelta, // east longitude
];

document.addEventListener("DOMContentLoaded", () => {
  const sofiaCenter = [sofiaCenterLat, sofiaCenterLon];
  const initialZoom = 19;

  map = L.map("map", {
    zoom: initialZoom,
    maxZoom: initialZoom,
    center: sofiaCenter,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: initialZoom,
  }).addTo(map);

  trafficLights.init(map);

  var bounds = L.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]);
  map
    .once("zoomend", function () {
      map.fitBounds(bounds, { maxZoom: initialZoom });
    })
    .setView(sofiaCenter, initialZoom);
});

const socket = new WebSocket("ws://100.117.70.32:8080/ws");

socket.onopen = () => {
  console.log("WebSocket connection opened");
};

socket.onmessage = (event) => {
  var trafficLightsArrayData = JSON.parse(event.data);

  console.log("Message from the server:", trafficLightsArrayData);
  trafficLightsArray.updatetrafficLightsArray(trafficLightsArrayData);
};

socket.onclose = (event) => {
  console.log("WebSocket connection closed");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};
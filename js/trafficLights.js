const trafficLights = (function () {
  const module = {};
  const trafficLightMarkers = {}; // Store markers by OSM ID

  const createTrafficLightIcon = (color) => {
    return L.divIcon({
      className: "traffic-light-icon",
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    });
  };

  const icons = {
    green: createTrafficLightIcon("green"),
    yellow: createTrafficLightIcon("yellow"), // just in case
    red: createTrafficLightIcon("red"),
  };

  module.init = (map) => {
    const markersLayer = L.layerGroup().addTo(map);

    queryTrafficLights(markersLayer);
  };

  const queryTrafficLights = (markersLayer) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const bboxString = bbox.join(",");
    const query = `[out:json];(node["highway"="traffic_signals"](${bboxString}););out;`;
    const encodedQuery = encodeURIComponent(query);

    fetch(overpassUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodedQuery,
    })
      .then((response) => response.json())
      .then((data) => {
        markersLayer.clearLayers();
        data.elements.forEach((element) => {
          const marker = L.marker([element.lat, element.lon], {
            icon: icons.red,
          }).addTo(markersLayer);
          trafficLightMarkers[element.id] = marker; // Store marker by OSM ID
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  module.updateTrafficLights = function (trafficLightsData) {
    var marker = trafficLightMarkers[trafficLightsData.traffic_light_id];
    if (marker) {
      marker.setIcon(icons[trafficLightsData.traffic_light_state]);
    }
    console.log("Updated traffic light", trafficLightsData.traffic_light_id, "to", trafficLightsData.traffic_light_state);
  };

  return module;
}());
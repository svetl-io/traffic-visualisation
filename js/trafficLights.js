var trafficLights = (function () {
    var module = {};
    var trafficLightMarkers = {}; // Store markers by OSM ID

    function createTrafficLightIcon(color) {
        return L.divIcon({
            className: "traffic-light-icon",
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
        });
    }

    var icons = {
        green: createTrafficLightIcon("green"),
        yellow: createTrafficLightIcon("yellow"), // just in case
        red: createTrafficLightIcon("red"),
    };

    module.init = function (map) {
        var markersLayer = L.layerGroup().addTo(map);

        queryTrafficLights(markersLayer);
    };

    function queryTrafficLights(markersLayer) {
        var overpassUrl = "https://overpass-api.de/api/interpreter";
        var bboxString = bbox.join(',');
        var query = `[out:json];(node["highway"="traffic_signals"](${bboxString}););out;`;
        var encodedQuery = encodeURIComponent(query);

        fetch(overpassUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", },
            body: "data=" + encodedQuery,
        })
            .then(response => response.json())
            .then(data => {
                markersLayer.clearLayers();
                data.elements.forEach(element => {
                    var marker = L.marker([element.lat, element.lon], { icon: icons.red }).addTo(markersLayer);
                    trafficLightMarkers[element.id] = marker; // Store marker by OSM ID
                });
            })
            .catch(error => console.error("Error:", error));
    }

    // todo: Function to update traffic light colors based on backend data
    module.updateTrafficLights = function (trafficLightsData) {
        trafficLightsData.forEach(light => {
            var marker = trafficLightMarkers[light.id];
            if (marker) {
                marker.setIcon(icons[light.color]);
            }
        });
    };

    return module;
}());

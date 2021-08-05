// Links
var quakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var basemapurl = "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"

// Map Object
let myMap = L.map("map", {
    center: [38, -96],
    zoom: 5
})

// Base map tile layer
L.tileLayer(basemapurl, {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(myMap);

function chooseColor(depth) {
    if (depth < 5) return "red";
    else if (depth < 10) return "orange";
    else if (depth <15) return "red";
    else if (depth < 20) return "maroon";
    else return "gray";}

    function markerSize(magnitude) {
        return (magnitude)*15000
    }

// Bring in geoJSON info
d3.json(quakeurl).then(data => {

    console.log(data)

    for (i=0;i<data.features.length;i++) {

        var magnitude = data.features[i].properties.mag

        L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
                    fillOpacity: 0.5,
                    fillColor: chooseColor(data.features[i].geometry.coordinates[2]),
                    radius: markerSize(magnitude),
                    weight: 0.4,
                    color: "black"
        }).bindPopup(`<h2>Magnitude: ${magnitude}</h2>`).addTo(myMap)
    }
})
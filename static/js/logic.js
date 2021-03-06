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
    if (depth < 5) return "yellow";
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
        var depth = data.features[i].geometry.coordinates[2]

        L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
                    fillOpacity: 0.5,
                    fillColor: chooseColor(depth),
                    radius: markerSize(magnitude),
                    weight: 0.4,
                    color: "black"
        }).bindPopup(`<h3>Magnitude: ${magnitude} <br>Depth: ${depth}</h3>`).addTo(myMap)
    }

    // Add legend
    var legend = L.control({position: "bottomright"})
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend")
        var limits = ['<5','5-10','10-15','15-20','>20']
        var colors = ['yellow','orange','red','maroon','gray']
        var labels = []

        limits.forEach(function(limit, index) {
            labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 60px; text-align:center"+ "; height: 20px" + "\">" + limit + "</li></div>");
        });

        div.innerHTML += "<h1 style='color:white;text-align:right;'>Depth</h1><ul style = 'list-style-type:none;'><h3>" + labels.join("") + "</h3></ul>";
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
})
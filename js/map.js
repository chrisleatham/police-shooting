// Chris Leatham
// Mike Freeman
// INFO 343 A


// JavaScript for creating a map using MapBox, taking data from a JSON file, plotting points based on variables, adding up statistics, then sending them to the HTML Table. 


// Establishing layers
var map;
var unknownGLayer = new L.LayerGroup([]);
var maleLayer = new L.LayerGroup([]);
var femaleLayer = new L.LayerGroup([]);
var allLayers = {
    "Gender: Male": maleLayer,
    "Gender: Female": femaleLayer,
    "Gender: Unknown": unknownGLayer
}


// Establishing variables
var hitMale = 0;
var killedMale = 0;
var hitFemale = 0;
var killedFemale = 0;
var hitUnknown = 0;
var killedUnknown = 0;

// drawMap
var drawMap = function() {
    var tilesLayer = L.tileLayer("https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hyaXNsZWF0aGFtMTMiLCJhIjoiY2lmc2xqeW1sMWUzcWxma3JnMTl5ejA0cCJ9.fa6sIq_E4aJX-uOlpF-HqA");
    map = L.map("container", {
        center: [39.875, -98.6546],
        zoom: 3
    });
    

    tilesLayer.addTo(map);
    getData();
}

// getData gets the data with which to populate the map, using an AJAX request, then sends it
// to customBuild upon success.
var getData = function() {
    var data;
    $.ajax({
        url: "data/response.json",
        type: "get",
        success: function(dat) {
            data = dat;
            customBuild(data);
        },
        dataType: "json"
    });
}

// Loops through the data and determines what the victims qualities are depending on 
// what happened.
var customBuild = function(data) {
    for (var i = 0; i < data.length; i++) {

        // Location of shooting (latitude and longitude)
        var lat = data[i]["lat"];
        var lng = data[i]["lng"];

        // The name of the victim
        var Name = data[i]["Victim Name"];
        if (Name == "undefined") {
            Name = "Unknown";
        }

        // The gender of the victim
        var Gender = data[i]["Victim's Gender"];
        if (Gender != "Male" && Gender != "Female") {
            Gender = "Unknown";
        }

        // The race of the victim
        var Race = data[i]["Race"];
        if (Race == "undefined") {
            Race = "Unknown";
        }

        // What the result of the shooting is 
        var Survive = data[i]["Hit or Killed?"];
        if (Survive == "undefined") {
            Survive = "Unknown";
        }

        // Tells whether a summary of the shooting is available
        var Summary = data[i]["Summary"];
        if (Summary == "undefined") {
            Summary = "No summary known";
        }

        //Determines the source link of the article for the shooting
        var Source = data[i]["Source Link"];

        // Add up each count of the variables
        if (Gender == "Male") {
            (data[i]["Hit or Killed?"] == "Killed") ? killedMale++ : hitMale++;
        } else if (Gender == "Female") {
            (data[i]["Hit or Killed?"] == "Killed") ? killedFemale++ : hitFemale++;
        } else {
            (data[i]["Hit or Killed?"] == "Killed") ? killedUnknown++ : hitUnknown++;
        }

        // Creates the popup and puts it in the location
        var description = "<h3>" + Name + "</h3>" + "<p>Hit or Killed:  " + Survive + "</p><p>Gender: " + Gender + "</p><p>Race: " + Race + "<p>Summary: " + Summary + "</p><p>Source: " + "<a href='" + Source + "'>" + Source + "</a></p>";
        var popup = new L.popup({
            maxHeight: 200
        }).setLatLng(lat, lng).setContent(description);

        // Inserts circle at incident site, adds circle to genderLayer and binds to popup.
        if (Gender == "Male") {
            var circle = new L.circle([lat, lng], 500, {
                color: "#87CEFA",
                fillColor: "#87CEFA",
                fillOpacity: 0.6,
            }).addTo(maleLayer).bindPopup(popup);
        } else if (Gender == "Female") {
            var circle = new L.circle([lat, lng], 500, {
                color: "#FFB6C1",
                fillColor: "#FFB6C1",
                fillOpacity: 0.6,
            }).addTo(femaleLayer).bindPopup(popup);
        } else {
            var circle = new L.circle([lat, lng], 500, {
                color: "#D3D3D3",
                fillColor: "#D3D3D3",
                fillOpacity: 0.6,
            }).addTo(unknownGLayer).bindPopup(popup);
        }
    }

    // Displaying layers.
    maleLayer.addTo(map);
    femaleLayer.addTo(map);
    unknownGLayer.addTo(map);
    L.control.layers(null, allLayers).addTo(map);

    // Updating statistics of the table.
    $("#hitMaleTotal").text(hitMale);
    $("#killedMaleTotal").text(killedMale);
    $("#hitFemaleTotal").text(hitFemale);
    $("#killedFemaleTotal").text(killedFemale);
    $("#hitUnknownTotal").text(hitUnknown);
    $("#killedUnknownTotal").text(killedUnknown);

}
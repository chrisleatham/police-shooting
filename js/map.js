// Gender variables.
var hitMale = 0;
var killedMale = 0;
var hitFemale = 0;
var killedFemale = 0;
var hitUnknown = 0;
var killedUnknown = 0;

// Initializing map and its layers.
var map;
var maleLayer = new L.LayerGroup([]);
var femaleLayer = new L.LayerGroup([]);
var unknownGLayer = new L.LayerGroup([]);
var allLayers = {
    "Gender: Male": maleLayer,
    "Gender: Female": femaleLayer,
    "Gender: Unknown": unknownGLayer
}

// drawMap draws the map, then calls getData.
var drawMap = function() {

    //OSM map:

    var map = L.map("container").setView([30, -100], 4);
    var layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
    layer.addTo(map);


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

// Loops through all the victims and updates the map according to their respective data and
// location.
var customBuild = function(data) {
    for (var i = 0; i < data.length; i++) {

        // Determines the location of the shooting.
        var lat = data[i]["lat"];
        var lng = data[i]["lng"];

        // Determines victimName.
        var victimName = data[i]["Victim Name"];
        if (victimName == "undefined") {
            victimName = "Unknown";
        }

        // Determines victimGender.
        var victimGender = data[i]["Victim's Gender"];
        if (victimGender != "Male" && victimGender != "Female") {
            victimGender = "Unknown";
        }

        // Determines victimRace.
        var victimRace = data[i]["Race"];
        if (victimRace == "undefined") {
            victimRace = "Unknown";
        }

        // Determines victimSurvive.
        var victimSurvive = data[i]["Hit or Killed?"];
        if (victimSurvive == "undefined") {
            victimSurvive = "Unknown";
        }

        // Determines summary and source.
        var victimSummary = data[i]["Summary"];
        if (victimSummary == "undefined") {
            victimSummary = "Summary unknown.";
        }
        var victimSource = data[i]["Source Link"];

        // Updates statistics.
        if (victimGender == "Male") {
            if (data[i]["Hit or Killed?"] == "Hit") {
                hitMale++;
            } else {
                killedMale++;
            }
        } else if (victimGender == "Female") {
            if (data[i]["Hit or Killed?"] == "Hit") {
                hitFemale++;
            } else {
                killedFemale++;
            }
        } else {
            if (data[i]["Hit or Killed?"] == "Hit") {
                hitUnknown++;
            } else {
                killedUnknown++;
            }
        }

        // Information to be included in infoPopup.
        var info = "<h3>" + victimName + "</h3>" + "<p>Survived?: " + victimSurvive + "</p><p>Gender: " + victimGender + "</p><p>Race: " + victimRace + "<p>Summary: " + victimSummary + "</p><p>Source: " + "<a href='" + victimSource + "'>" + victimSource + "</a></p>";

        // Popup at incident site.
        var infoPopup = new L.popup({
            maxHeight: 200
        }).setLatLng(lat, lng).setContent(info);

        // Inserts circle at incident site, adds circle to genderLayer and binds to popup.
        if (victimGender == "Male") {
            var circle = new L.circle([lat, lng], 10, {
                color: blue,
                fillColor: blue,
                fillOpacity: 0.25,
            }).addTo(maleLayer).bindPopup(infoPopup);
        } else if (victimGender == "Female") {
            var circle = new L.circle([lat, lng], 10, {
                color: pink,
                fillColor: pink,
                fillOpacity: 0.25,
            }).addTo(femaleLayer).bindPopup(infoPopup);
        } else {
            var circle = new L.circle([lat, lng], 10, {
                color: gray,
                fillColor: gray,
                fillOpacity: 0.25,
            }).addTo(unknownGLayer).bindPopup(infoPopup);
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
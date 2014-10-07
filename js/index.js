//------------------------maps------------------------
var geocode = '';
var latcoord, longcoord;
maplat = -23.7;
maplong = 133.87;
mapzoom = 4;

$("#openmap").click(function () {
    var x, y
    y = ($(document).height() / 4) * 3;
    x = ($(document).width() / 4) * 3;
    $("#mapbox").dialog({ draggable: false, height: y, width: x, modal: true, beforeClose: MapClose });
    initialize(); //creates the map
    function MapClose(event, ui) {
        //gets the geocode and finds the town name from it
        geocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latcoord + ',' + longcoord + '&key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E';
        $.getJSON(geocode, function (r) {
            try {
                town = r.results[0].address_components;
            }
            catch (err) {
                alert('Why are you selecting the ocean, this is a town timeline!')
                return
            }
            len = town.length;
            var final;
            // Find the townname in the JSON
            for (i = 0; i < len; i++) {
                e = r.results[0].address_components[i].types[0]
                // The townname has the type of 'locality'
                if (e == "locality") {
                    final = r.results[0].address_components[i].long_name;
                    break;
                }
            }
            // If we get nothing back, the tell the user to get better
            if (!final) {
                console.log('You gone broke shit');
                alert('That place is not in the database');
                return
            }
            console.log(final);
            document.getElementById('town-name').value = final;
        });
        //can we destroy the map? I looked it up and the answer looks like it is no, but I am not sure
        //also I am not sure if you close the modal box and then open it, if it is the same map. If it isn't then there is a huge memory usage issue here that needs to be fixed
        //just tested, I think it is new map is made every time. Need to have something a bit more conlusive though
    }
});

function initialize() {
    //set up map options and create the map
    var mapOptions = {
        center: { lat: maplat, lng: maplong },
        zoom: mapzoom
    };
    var map = new google.maps.Map(document.getElementById('mapbox'), mapOptions);

    // Creates the marker on the centre of the map
    var center = map.getCenter();
    var marker = new google.maps.Marker({
        position: center,
        map: map,
        draggable: true
    });

    latcoord = marker.position.lat();
    longcoord = marker.position.lng();

    // Adds an event that detects when the marker is dropped and gets the coords
    google.maps.event.addListener(marker, 'dragend',
    function () {
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        mapzoom = map.getZoom();
    });

    // Move the marker so it is centered after the map is moved - TO BE COMPLETED
    /*
    google.maps.event.addListener(map, 'dragend',
    function () {
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: center,
            map: map,
            draggable: true
        });
    });*/
}
//------------------------end of maps------------------------

$(function () {
    $("#town-name").autocomplete({
        source: 'autocomplete.php',
        minLength: 1,
        select: function (event, ui) {
            console.log(ui.item.id);
        }
    });
});
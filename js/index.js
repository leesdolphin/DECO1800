//------------------------maps------------------------
var geocode = '';
var latcoord, longcoord;
var maplat = -23.7;
var maplong = 133.87;
var mapzoom = 4;

$("#openmap").click(function () {
    var x, y;
    y = ($(document).height() / 4) * 3;
    x = ($(document).width() / 4) * 3;
    $("#mapbox").dialog({ draggable: false, height: y, width: x, modal: true, beforeClose: MapClose });
    initialize(); //creates the map
    function MapClose(event, ui) {
        //gets the geocode and finds the town name from it
        geocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latcoord + ',' + longcoord + '&key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E';
        $.getJSON(geocode, function (r) {
            // If they select the ocean then there will be no address components, so tell the user to not do that
            try {
                town = r.results[0].address_components;
            }
            catch (err) {
                alert('Why are you selecting the ocean, this is a town timeline!')
                return
            }
            len = town.length;
            var final;
            var country;
            // Find the townname in the JSON
            for (i = 0; i < len; i++) {
                e = r.results[0].address_components[i].types[0]
                // The townname has the type of 'locality'
                if (e == "locality") {
                    final = r.results[0].address_components[i].long_name;
                }
                if (e == "country") {
                    if (r.results[0].address_components[i].long_name == "Australia"){
                        country = 1;
                    }
                }
            }
            
            // If we get nothing back, the tell the user to get better. They should never get this message but better safe then sorry
            if (!final) {
                console.log('You gone broke shit');
                alert('That place is not in the database');
                return
            }
            
            // And if they select another country berate them as well.
            if (!country){
                alert('Please select a location in Australia');
                return;
            }
            
            console.log(final);
            document.getElementById('town-name').value = final;
            
            // configure map so it has the same settings for next time
            maplat = latcoord;
            maplong = longcoord;
        });
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
    // the hard word is given to an external function
    // oh and for some reason the callback has to be inside a function. Don't ask me why.
    google.maps.event.addListener(marker, 'dragend', function(){enddrag();});

    // Move the marker so it is centered after the map is moved
    google.maps.event.addListener(map, 'dragend',
    function () {
        marker.setMap(null);
        var center = map.getCenter();
        marker = new google.maps.Marker({
            position: center,
            map: map,
            draggable: true
        });
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        // you have to rebind the drag event since the old marker was deleted
        google.maps.event.addListener(marker, 'dragend', function(){enddrag();});
    });
    
    // handles stuff when the map is zoomed
    google.maps.event.addListener(map, 'zoom_changed',
    function () {
        marker.setMap(null);
        var center = map.getCenter();
        marker = new google.maps.Marker({
            position: center,
            map: map,
            draggable: true
        });
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        // you have to rebind the drag event since the old marker was deleted
        google.maps.event.addListener(marker, 'dragend', function(){enddrag();});
    });
    
    // does the hard work at the end of a drag of a marker
    function enddrag(){
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        mapzoom = map.getZoom();
        latlng = new google.maps.LatLng(latcoord, longcoord)
        map.panTo(latlng);
    }
}
//------------------------end of maps------------------------

// handles autocomplete in the search bar
$(function () {
    $("#town-name").autocomplete({
        source: 'autocomplete.php',
        minLength: 1,
        select: function (event, ui) {
            console.log(ui.item.id);
        }
    });
});
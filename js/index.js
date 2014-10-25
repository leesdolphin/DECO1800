//------------------------maps------------------------
var geocode = '';
var latcoord, longcoord;
var maplat = -23.7;
var maplong = 133.87;
var mapzoom = 4;
var NEBound = new google.maps.LatLng(-8.640910979783591, 156.54578125);
var SWBound = new google.maps.LatLng(-44.5083642249821, 110.051640625);

$("#openmap").click(function () {
    var x, y;
    y = ($(document).height() / 4) * 3;
    x = ($(document).width() / 4) * 3;
    $("#mapbox").dialog({draggable: false, 
                         height: y,
                         width: x,
                         modal: true,
                         resizable: false,
                         beforeClose: MapClose,
                         dialogClass: 'mapdialog',
                         closeText: "hide",
                         closeOnEscape: "True",
                         buttons: [
                             {text: "Select Town",
                              click: function(){$("#mapbox").dialog("close")}
                             }],
                         open: function(event,ui) {
                                $('.ui-widget-overlay').bind('click', function(event,ui) {         
                                    $('#mapbox').dialog('close');
                                });
                         }
                        });
    // Becuase of styling requirments and the limitations of JQuery UI, we need to do the close button and description ourselves
    $('.ui-dialog-buttonset button').before('<div id="maptext">Move the marker over the town you want to search for</div>');
    $('.ui-dialog-buttonset button').attr('class', 'btn');
    $('#closebutton').click(function(){
         $("#mapbox").dialog("close");
    });
    initialize(); // Creates the map
    function MapClose(event, ui) {
        // Gets the geocode and finds the town name from it
        geocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latcoord + ',' + longcoord + '&key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E';
        $.getJSON(geocode, function (r) {
            // If they select the ocean then there will be no address components, so tell the user to not do that
            try {
                town = r.results[0].address_components;
            }
            catch (err) {
                alert('Why are you selecting the ocean, this is a town timeline!');
                return;
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
                // Also we don't want to get results from other countries
                if (e == "country") {
                    if (r.results[0].address_components[i].long_name == "Australia"){
                        country = 1;
                    }
                }
            }
            
            // If we get nothing back, the tell the user to get better. They should never get this message but better safe then sorry
            if (!final) {
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
            
            // Configure map so it has the same settings for next time
            maplat = latcoord;
            maplong = longcoord;
        });
    }
});

function initialize() {
    //set up map options and create the map
    var mapOptions = {
        center: { lat: maplat, lng: maplong },
        zoom: mapzoom,
        minZoom: 4
    };
    var map = new google.maps.Map(document.getElementById('mapbox'), mapOptions);
    
    var strictBounds = new google.maps.LatLngBounds(SWBound, NEBound);

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
    google.maps.event.addListener(map, 'dragend', function () {movemap();});
    
    // handles stuff when the map is zoomed
    google.maps.event.addListener(map, 'zoom_changed', function () {movemap();});
    
    // Does the hard work at the end of a drag of a marker
    function enddrag(){
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        mapzoom = map.getZoom();
        var latlng = new google.maps.LatLng(latcoord, longcoord);
        map.panTo(latlng);
        if (!strictBounds.contains(latlng)){
            movemap();
            return;
        }  
    }
    
    function movemap(){
        // Moves the marker to the centre of the map and checks if this place is valid
        checkmove();
        var center = map.getCenter();
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: center,
            map: map,
            draggable: true
        });
        latcoord = marker.position.lat();
        longcoord = marker.position.lng();
        // you have to rebind the drag event since the old marker was deleted
        google.maps.event.addListener(marker, 'dragend', function(){enddrag();});
    }
    
    function checkmove(){
        // Checks to see if the map location is valid (in Australia)
        // Returns true if there was a problem, false if there was not
        var center = map.getCenter();
        if (!strictBounds.contains(center)){
            var x = center.lng(),
                y = center.lat(),
                maxX = strictBounds.getNorthEast().lng(),
                maxY = strictBounds.getNorthEast().lat(),
                minX = strictBounds.getSouthWest().lng(),
                minY = strictBounds.getSouthWest().lat();
            if (x < minX) x = minX;
            if (x > maxX) x = maxX;
            if (y < minY) y = minY;
            if (y > maxY) y = maxY;
            //map.setCenter(new google.maps.LatLng(y, x));
            map.panTo(new google.maps.LatLng(y, x));
            return true;
        } else{
            return false;
        }
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
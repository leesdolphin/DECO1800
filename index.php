<!DOCTYPE html>
<html>
    <head>
        <title>Town Timeline</title>
        <?php include 'include/head.php'; ?>
        <link rel="stylesheet" href="css/index.css" />
    </head>
    <body>
        <div class="header"></div>
        <div class="container">
            <div class="jumbotron">
                <h1>Town Timeline</h1>
                <p>Find your town, explore it's history.</p>
                <form action="town.php" method="GET">
                    <div class="form-group form-group-lg" >
                        <input class="form-control" type="text" name="town" id="town-name" required placeholder="Town Name" />
                    </div>
                    <input class="btn btn-primary btn-lg" type="submit" id="submit" value="Search"/>                  
                    <button class="btn btn-default btn-lg" type="button"  id="openmap">
                        Map <span class="glyphicon glyphicon-map-marker"></span>
                    </button>
                </form>
            </div>
        </div>
        <div id="mapbox"></div>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E"></script>
        <script type="text/javascript">
            var geocode = '';
            var latcoord, longcoord;
            $("#openmap").click(function () {
                var x, y
                y = ($(document).height() / 4) * 3;
                x = ($(document).width() / 4) * 3;
                $("#mapbox").dialog({ draggable: false, height: y, width: x, modal: true, beforeClose: MapClose });
                initialize(); //creates the map
                function MapClose(event, ui) {
                    geocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latcoord + ',' + longcoord + '&key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E';
                    $.getJSON(geocode, function (r) {
                        town = r.results[0].address_components[2].long_name;
                        console.log(town);
                        document.getElementById('town-name').value = town;
                    });
                    //can we destroy the map? I looked it up and the answer looks like it is no, but I am not sure
                    //also I am not sure if you close the modal box and then open it, if it is the same map. If it isn't then there is a huge memory usage issue here that needs to be fixed
                    //just tested, I think it is new map is made every time. Need to have something a bit more conlusive though
                }
            });

            function initialize() {
                //set up map options and create the map
                var mapOptions = {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8
                };
                var map = new google.maps.Map(document.getElementById('mapbox'), mapOptions);

                // Creates the marker on the centre of the map
                var center = map.getCenter();
                var marker = new google.maps.Marker({
                    position: center,
                    map: map,
                    draggable: true
                });

                // Adds an event that detects when the marker is dropped and formats the geocode
                google.maps.event.addListener(marker, 'dragend',
                function () {
                    latcoord = marker.position.lat();
                    longcoord = marker.position.lng();
                });
            }

            $(function () {
                $("#town-name").autocomplete({
                    // does nothing, soz - JACK
                    source: 'autocomplete.php',
                    minLength: 1,
                    select: function (event, ui) {
                        alert(ui.item.id);
                    }
                });
            });
        </script>
    </body>
</html>

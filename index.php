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
                    <!--This is the button for the map, needs to be implemented. Just for the mockup right now.-->
                </form>
            </div>
        </div>
        <div id="mapbox"></div>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E"></script>
        <script type="text/javascript">
            var maplocation = '';
            $("#openmap").click(function () {
                var x, y
                y = ($(document).height() / 4) * 3;
                x = ($(document).width() / 4) * 3;
                $("#mapbox").dialog({ draggable: false, height: y, width: x, modal: true, beforeClose: MapClose });
                function MapClose(event, ui) {
                    document.getElementById('town-name').value = maplocation;
                }
            });

            function initialize() {
                var mapOptions = {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8
                };
                var map = new google.maps.Map(document.getElementById('mapbox'), mapOptions);
                var center = map.getCenter();
                var marker = new google.maps.Marker({
                    position: center,
                    map: map,
                    draggable: true
                });

                google.maps.event.addListener(marker, 'dragend',
                function () {
                    var latcoord = marker.position.lat();
                    var longcoord = marker.position.lng();
                    geocode = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latcoord + ',' + longcoord + '&key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E';
                    console.log(geocode);
                    $.getJSON(geocode, function (r) {
                        town = r.results[0].address_components[2].long_name;
                        console.log(town);
                        maplocation = town;
                    });
                });
            }
            google.maps.event.addDomListener(window, 'load', initialize);

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

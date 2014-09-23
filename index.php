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
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>

<!DOCTYPE html>
<html>
    <head>
        <title>Town Timeline</title>
        <?php include 'include/head.php'; ?>
        <link rel="stylesheet" href="css/index.css" />
        <link href='http://fonts.googleapis.com/css?family=Droid+Serif:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div class="header"></div>
        <div class="container">
            <div class="jumbotron">
                <h1>Town Timeline</h1>
                <p>Find your town, explore its history.</p>
                <form action="town.php" method="GET" id="townform">
                    <div class="form-group form-group-lg" >
                        <!--<input class="form-control" type="search" name="town" id="town-name" required placeholder="Town Name" />
                        <span class="glyphicon glyphicon-search" id="submitspan"></span>

                        <div class="input-group">
                            <input type="text" class="form-control" name="town" id="town-name" required placeholder="Town Name"/>
                            <span class="input-group-addon">
                                <i class="fa fa-search"><button type="submit"><span class="glyphicon glyphicon-search" id="submitspan"></span></button></i>
                            </span>
                        </div>

                        <div class="input-group">
                           <input type="text" class="form-control" name="town" id="town-name" required placeholder="Town Name">
                           <button class="input-group-addon"><span class="glyphicon glyphicon-search" ></span></button>
                        </div>-->

                         <div class="input-group">
                            <input type="text" class="form-control" name="town" id="town-name" required placeholder="Town Name">
                            <button class="input-group-addon" id="submit"><span class="glyphicon glyphicon-search" ></span></button>
                            <button class="btn" type="button"  id="openmap">
                                <span class="glyphicon glyphicon-map-marker"></span>
                            </button>
                        </div>
                    </div>
                    <!--<input class="btn btn-primary btn-lg" type="submit" id="submit" value="Search"/>                  
                    <button class="btn btn-default btn-lg" type="button"  id="openmap">
                        Map <span class="glyphicon glyphicon-map-marker"></span>
                    </button>-->
                </form>
            </div>
        </div>
        <div id="mapbox"></div>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>

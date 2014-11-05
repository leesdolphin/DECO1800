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
                    <div class="input-group">
                        <input type="text" class="form-control" name="town" id="town-name" required placeholder="Town Name">
                        <span class="input-group-btn">
                            <button type="submit" class="btn" id="submit">
                                <span class="glyphicon glyphicon-search" ></span>
                            </button>
                            <button type="button" class="btn" id="openmap">
                                <span class="glyphicon glyphicon-map-marker"></span>
                            </button>
                        </span>
                    </div>
                </div>
                <?php if(array_key_exists("invalid", $_GET) && array_key_exists("town", $_GET)) { ?>
                    <div class="alert alert-danger" role="alert">
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                        <strong>Invalid Town!</strong> The town <span class="mark"><?php echo $_GET["town"]; ?></span> is not valid.
                    </div>
                    <?php } ?>
                </form>
            </div>
        </div>
        <div id="mapbox">
            <div id="mapdiv"></div>
            <!--<div id="mapclose">
            <button type="button" class="btn" id="closebutton">Close Map</button>
            </div>-->
        </div>
        <div id='igotthepower' class="navbar-fixed-bottom"><a href='http://trove.nla.gov.au/' target="_blank"><img src='http://trove.nla.gov.au/general-test/files/2012/01/API-dark.png' alt='Powered By Trove' /></a></div>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_BwCPZ-1J8sAyMObpRo0EkoB7D-95Y7E"></script>
    <script type="text/javascript" src="js/index.js"></script>
</body>
</html>

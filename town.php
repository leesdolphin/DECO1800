<?php
$town = $_GET["town"];
if (!isset($_GET["town"])) {
    header('Location: index.php');
    return;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Town Timeline</title>
        <?php include 'include/head.php'; ?>
        <script>
            window.town = <?php echo json_encode($town); ?>;
        </script>
        <link rel="stylesheet" href="css/town.css" />
        <script src="js/document_utils.js"></script>
        <script src="js/trove.js"></script>
        <script src="js/town_db_utils.js"></script>
        <script src="js/town_db.js"></script>
        <script src="js/town.js"></script>
    </head>
    <body>
        <div class="navbar navbar-fixed-top navbar-default">
            <div class="navbar-timeline">
                <div id="navbar-year-container">
                    <div class="navbar-year" id="navbar-cent-1960">
                        1910
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1920
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1930
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1940
                    </div>
                    <div class="navbar-year" id="navbar-year-1948">
                        1948
                    </div>
                    <div class="navbar-year" id="navbar-year-1949">
                        1949
                    </div>
                    <div class="navbar-year navbar-year-current" id="navbar-year-1950">
                        1950
                    </div>
                    <div class="navbar-year" id="navbar-year-1951">
                        1951
                    </div>
                    <div class="navbar-year" id="navbar-year-1952">
                        1952
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1960
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1970
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1980
                    </div>
                    <div class="navbar-year" id="navbar-cent-1960">
                        1990
                    </div>
                </div>
                <div id="navbar-month-container">
                    Loading
                </div>
            </div>
            <ul class="nav navbar-nav navbar-left">
                <li><a class="navbar-brand" href="index.php">Town Timeline</a></li>
            </ul>
            <ul class="nav navbar-right navbar-text">
                <li>
                    <span id="loading-spinner" class="glyphicon glyphicon-refresh hidden"></span>
                </li>
            </ul>
        </div>
        <div class="container">
            <div id="timeline"></div>
        </div>

    </body>
</html>

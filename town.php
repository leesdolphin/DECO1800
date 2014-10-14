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
        <script src="js/town_db_picture.js"></script>
        <script src="js/town_db.js"></script>
        <script src="js/town.js"></script>
    </head>
    <body>
        <div class="navbar navbar-fixed-top navbar-default">
            <div class="navbar-timeline">
                <div id="navbar-year-container">
                    Loading
                </div>
                <div id="navbar-loading-contaner">
                    <div id="navbar-loading-contaner-fill"></div>
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

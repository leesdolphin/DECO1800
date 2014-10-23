<?php
$town = $_GET["town"];
if (!isset($_GET["town"])) {
    header('Location: index.php');
    return;
}

/*
include './include/database.php';

$con = create_con();

$stmt = prepate_stmt($con, "SELECT TownName FROM TOWNPOP WHERE TownName LIKE ? ORDER BY TownName ASC LIMIT 1");
$stmt->bind_param("s", $town);
$stmt->execute();
$stmt->store_result();
$num_rows = $stmt->num_rows();
clean($con, $stmt);

if($num_rows == 0) {
    header('Location: index.php?invalid&town=' . urlencode($town), 304);
    return;
}
*/

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
        <script src="js/town_month.js"></script>
        <script src="js/town_year.js"></script>
        <script src="js/town.js"></script>
    </head>
    <body>
        <div class="navbar navbar-fixed-top navbar-default">
            <div class="navbar-timeline">
                <div id="navbar-year-overlay-left"></div>
                <div id="navbar-year-overlay-right"></div>
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
            <div id="timeline-padding"></div>
            <div id="timeline"></div>
        </div>

        <div id="lightboxContent">
			<div id="box">this is a test</div>
		</div>
        
    </body>
</html>

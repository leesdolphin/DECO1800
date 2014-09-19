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
        <script src="js/trove.js"></script>
        <script src="js/town.js"></script>
    </head>
    <body>
        <div class="navbar navbar-fixed-top navbar-default">
            <ul class="nav navbar-nav navbar-left">
                <li><a class="navbar-brand" href="index.php">Town Timeline</a></li>
                <li></li>
            </ul>
        </div>
        <div class="container">
            <div class="top-scroll-loading">
                <div>Loading More Content</div>
            </div>
            <div id="timeline"></div>
            <div class="bottom-scroll-loading">
                <div>Loading More Content</div>
            </div>
        </div>

    </body>
</html>

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
                </form>
            </div>
        </div>

    </body>
</html>

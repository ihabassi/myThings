<?php
    include 'dbConnect.php';

    // fetch the parameters sent from the angular http request (catId)
    $data = json_decode(file_get_contents("php://input"));
    // Set a query
    $sql = "CALL dataGet()";
    // connect to the DB
    $mysqli = new mysqli($db->dbhost, $db->dbuser, $db->dbpassword, $db->dbname);

    if (mysqli_connect_errno()) {
        die(printf(json_encode('MySQL Server connection failed: %s', mysqli_connect_error())));
    }   

    // Initialize our result set array
    $results = array();

    // set the charset
    $mysqli->set_charset($db->charset);
    if ($mysqli->multi_query($sql)) {
        do {
     
            // Lets work with the first result set
            if ($result = $mysqli->use_result()) {
                // Loop the first result set, reading the records into an array
                while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
                    $records[] = $row;
                    array_push($results, $row);
                }
     
                // Close the record set
                $result->close();
            }
     
            // // Add this record set into the results array
            // if(count($records) > 0) $results[] = $records;
        } while ($mysqli->more_results() && $mysqli->next_result());
    }
     
    // Close the connection
    $mysqli->close();

    print json_encode($results);
?>
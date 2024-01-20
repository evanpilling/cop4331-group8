<?php

    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $name = $inData["name"];

    $conn = new mysqli("localhost", "The Beast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error) {
        returnWithError( $conn->connect_error );
    }

    else {
        $stmt = $conn->prepare("DELETE from Users (UserId,Name) VALUES(?,?)");
        $stmt = bind_param("ss", $userId, $name);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj ) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err ) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>

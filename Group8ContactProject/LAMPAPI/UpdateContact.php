<?php
    $inData = getRequestInfo();

    $SelectedFirstName = $inData["SelectedFirstName"];
    $SelectedLastName = $inData["SelectedLastName"];

    $NewFirstName = $inData["NewFirstName"];
    $NewLastName = $inData["NewLastName"];
    $NewEmailAddress = $inData["NewEmailAddress"];

    $UserID = $inData["UserID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName='$NewFirstName', LastName='$NewLastName', Email='$NewEmailAddress' WHERE FirstName='$SelectedFirstName' AND LastName='$SelectedLastName' AND UserID='$UserID'");
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }
    
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>

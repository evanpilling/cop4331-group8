<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Login = $inData["Login"];
	$Password = $inData["Password"];
	$Email = $inData["Email"];
	$HashedPassword = password_hash($Password, PASSWORD_DEFAULT, array("cost" => 10));

	// Establishes connection to MySQL database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $checkStmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
        $checkStmt->bind_param("s", $Login);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

		if ($checkResult->num_rows > 0) {
			$checkStmt->close();
			returnWithError("Login already exists");
		}
		else {
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password, Email) VALUES(?,?,?,?,?)");
			$stmt->bind_param("sssss", $FirstName, $LastName, $Login, $HashedPassword, $Email);
			$stmt->execute();
			$stmt->close();
			$checkStmt->close();
			$conn->close();
			returnWithError("");
		}
	
		
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>

<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,firstName,lastName, Password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			$password = $inData["password"];
			$hash = $row["Password"];
			$options = array("cost" => 10);

			if (password_verify($password, $hash)) 
			{
				// Check if either the algorithm or the options have changed
				if (password_needs_rehash($hash, PASSWORD_DEFAULT, $options)) 
				{
					// If so, create a new hash, and replace the old one
					$newHash = password_hash($password, PASSWORD_DEFAULT, $options);
			
					// Update the user record with the $newHash
					$stmt = $conn->prepare("UPDATE Users SET Password=? WHERE Login=?");
					$stmt->bind_param("ss", $newHash, $inData["login"]);
					$stmt->execute();
					$stmt->close();	
				}
			
				// Perform the login.
				returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
			}
			else 
			{
				returnWithError("Invalid Password");
			}

		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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

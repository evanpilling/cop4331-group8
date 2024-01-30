const urlBase = 'http://www.cop4331-group8.xyz/LAMPAPI';
const extension = 'php';

let search = "";
let firstName = "";
let lastName = "";  

let tableFirstName = "";
let tableLastName = "";

document.addEventListener('DOMContentLoaded', function() 
{
	readCookie();
    getContacts(search);
}, false);

document.getElementById("logout__button").addEventListener("click", function() {
    userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
});

document.getElementById('addContactButton').addEventListener('click', function() {
    document.getElementById('addContactPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('addContactPopup').style.display = 'none';
});

document.getElementById('submitContact').addEventListener('click', function() {
		let contactFName = document.getElementById("firstNameContact").value;
		let contactLName = document.getElementById("lastNameContact").value;
		let contactEmail = document.getElementById("emailContact").value;
        let contactID = userId;
	
    
        let tmp = {FirstName:contactFName,LastName:contactLName,Email:contactEmail,UserID:contactID};
        let jsonPayload = JSON.stringify( tmp );
        
        let url = urlBase + '/AddContact.' + extension;
    
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    getContacts(search);
                }

            };
            xhr.send(jsonPayload);

        }
        catch(err)
        {
            console.error(err.message);
        }
    document.getElementById('addContactPopup').style.display = 'none';
});



function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("page_title").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function getContacts(searchFor) {

    
    const contactsTable = document.getElementById('contactsTable');
    let url = urlBase + '/SearchContact.' + extension;

	let tmp = {UserID:userId,Search:searchFor};
	let jsonPayload = JSON.stringify( tmp );

    let searchName = "";
    let searchEmail = "";

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				contactsTable.innerHTML = '';
                
                console.log(jsonObject);

				jsonObject.results.forEach(results => {
                    // Split obtained result by space FirstName LastName Email
                    tempResult = results.split(' ');
                    searchName = tempResult[0] + " " + tempResult[1];
                    searchEmail = tempResult[2];

					const row = document.createElement('tr');
					// Second searchEmail is temp for phone numbers
					row.innerHTML = `
						<td>${searchName}</td>
						<td>${searchEmail}</td>
						<td>${searchEmail}</td>
						<td style="text-align:center">
                        <div class="dropdown" id="dropdownContent">
                            <button class="dropbtn">...</button>
                            <div class="dropdown-content">
                            <a href="#">Edit Contact</a>
                            <a href="#">Delete Contact</a>
                            </div>
                        </div>
						</td>
					`;

                    const dropdownButton = row.querySelector('.dropbtn');
                    const dropdownContent = row.querySelector('.dropdown-content');
                    
                    dropdownButton.addEventListener('click', function (event) {
                        event.stopPropagation();
                        dropdownContent.style.display = 'block';
                    });

                    document.addEventListener('click', function (event) {
                            dropdownContent.style.display = 'none';
                    });
					contactsTable.appendChild(row);
						
				});
			}
			};
			xhr.send(jsonPayload);
		}

	catch(err)
    {
        console.error(err.message);
    }
}
	


document.getElementById('addContactButton').addEventListener('click', function() {
    document.getElementById('addContactPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('addContactPopup').style.display = 'none';
});

document.getElementById('submitContact').addEventListener('click', function() {

    document.getElementById('addContactPopup').style.display = 'none';
});



document.getElementById('contactsTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-contact-button')) {
        document.getElementById('editContactPopup').style.display = 'block';
		
    } else if (event.target.classList.contains('delete-contact-button')) {
        document.getElementById('deleteContactPopup').style.display = 'block';
    }

	const selectedRow = event.target.closest('tr');
    const contactName = selectedRow.querySelector('td:first-child').textContent;

    [tableFirstName, tableLastName] = contactName.split(' ');
});



document.getElementById('closeEditPopup').addEventListener('click', function() {
    document.getElementById('editContactPopup').style.display = 'none';
});

document.getElementById('closeDeletePopup').addEventListener('click', function() {
    document.getElementById('deleteContactPopup').style.display = 'none';
});

document.getElementById('cancelDeleteContact').addEventListener('click', function() {
    document.getElementById('deleteContactPopup').style.display = 'none';
});

document.getElementById('confirmDeleteContact').addEventListener('click', function() {
	deleteContact(tableFirstName, tableLastName);
    document.getElementById('deleteContactPopup').style.display = 'none';
});

document.getElementById('saveEditContact').addEventListener('click', function() {
    const editedFirstName = document.getElementById('editFirstName').value;
    const editedLastName = document.getElementById('editLastName').value;
    const editedEmail = document.getElementById('editEmail').value;

	editContact(tableFirstName, tableLastName, editedFirstName, editedLastName, editedEmail);

    document.getElementById('editContactPopup').style.display = 'none';
});

function editContact(editFirstName, editLastName, newFirstName, newLastName, newEmailAddress){



	let tmp = {UserID:userId,SelectedFirstName:editFirstName,SelectedLastName:editLastName,NewFirstName:newFirstName, NewLastName:newLastName, NewEmailAddress:newEmailAddress};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				getContacts(search);
			}

		};
		xhr.send(jsonPayload);

	}
	catch(err)
	{
		console.error(err.message);
	}
document.getElementById('addContactPopup').style.display = 'none';	
}

function deleteContact(deleteFirstName, deleteLastName){

	let tmp = {UserID:userId,FirstName:deleteFirstName,LastName:deleteLastName};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				getContacts(search);
			}

		};
		xhr.send(jsonPayload);

	}
	catch(err)
	{
		console.error(err.message);
	}
}
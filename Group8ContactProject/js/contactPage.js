const urlBase = 'http://www.cop4331-group8.xyz/LAMPAPI';
const extension = 'php';

let search = "";
let firstName = "";
let lastName = "";

document.addEventListener('DOMContentLoaded', function() 
{
	readCookie();
    getContacts(search);
}, false);

document.getElementById("logoutButton").addEventListener("click", function() {
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

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				contactsTable.innerHTML = '';

				jsonObject.results.forEach(results => {
					const row = document.createElement('tr');
					row.innerHTML = `
						<td>${results}</td>
						<td>${results}</td>
						<td>
							<button class="edit-contact-button">Edit Contact</button>
							<button class="delete-contact-button">Delete Contact</button>
						</td>
					`;
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

    [firstName, lastName] = contactName.split(' ');
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
	deleteContact(firstName, lastName);
    document.getElementById('deleteContactPopup').style.display = 'none';
});

document.getElementById('saveEditContact').addEventListener('click', function() {
    const editedFirstName = document.getElementById('editFirstName').value;
    const editedLastName = document.getElementById('editLastName').value;
    const editedEmail = document.getElementById('editEmail').value;

	editContact(firstName, lastName, editedFirstName, editedLastName, editedEmail);

    document.getElementById('editContactPopup').style.display = 'none';
});

function editContact(editFirstName, editLastName, newFirstName, newLastName, newEmailAddress){



	let tmp = {SelectedFirstName:editFirstName,SelectedLastName:editLastName,NewFirstName:newFirstName, NewLastName:newLastName, NewEmailAddress:newEmailAddress};
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






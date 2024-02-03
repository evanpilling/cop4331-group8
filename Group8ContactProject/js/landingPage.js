const urlBase = 'http://www.cop4331-group8.xyz/LAMPAPI';
const extension = 'php';
// =================================================== Above: API Links ===================================================


// =============================================== Below: Var Initalization ===============================================
let search = "e";
let firstName = "";
let lastName = "";

let tableFirstName = "";
let tableLastName = "";
// =============================================== Above: Var Initalization ===============================================


// =============================================== Below: Page Initalization ==============================================
document.addEventListener('DOMContentLoaded', function () {
    readCookie();
    getContacts(search);
}, false);
// =============================================== Above: Page Initalization ==============================================


// ==================================================== Below: Log Out ====================================================
document.getElementById("logout__button").addEventListener("click", function () {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
});
// ==================================================== Above: Log Out ====================================================


// ==================================================== Below: Cookies ====================================================
function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
    else {
        document.getElementById('page__title').innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}
// ==================================================== Above: Cookies ====================================================


// ================================================== Below: Data Table ===================================================
function getContacts(searchFor) {

    const contactsTable = document.getElementById('contactsTable');
    let url = urlBase + '/SearchContact.' + extension;

    let tmp = { UserID: userId, Search: searchFor };
    console.log(tmp + " hello");
    let jsonPayload = JSON.stringify(tmp);

    let searchName = "";
    let searchEmail = "";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                contactsTable.innerHTML = '';

                console.log(jsonObject);

                jsonObject.results.forEach(results => {
                    // Split obtained result by space FirstName LastName Email
                    tempResult = results.split(' ');
                    searchName = tempResult[0] + " " + tempResult[1];
                    searchEmail = tempResult[2];
                    console.log(results);
                    
                    const row = document.createElement('tr');
                    // Second searchEmail is temp for phone numbers
                    row.innerHTML = `
						<td style="vertical-align: middle;">${searchName}</td>
                        <td style="vertical-align: middle;">${searchName}</td>
						<td style="vertical-align: middle;">${searchEmail}</td>
						<td style="vertical-align: middle;">${searchEmail}</td>
                        <td style="text-align: center; vertical-align: middle">
                            <button class="bi bi-pencil-square" id="edit__button"></button>
                            <button class="bi bi-trash3" id="delete__button"></button>
                        </td>
					`;

                    contactsTable.appendChild(row);

                });
            }
        };
        xhr.send(jsonPayload);
    }

    catch (err) {
        console.error(err.message);
    }
}
// ================================================== Above: Data Table ===================================================


// ================================================== Below: Search Bar ===================================================

user__search.addEventListener("input", e => {
    getContacts(e.target.value);
    
    // let activeSearch = document.getElementById("search__bar__container");
    
    // if (e.target.value == "") {
    //     activeSearch.style.width = "25px";
    // }
    // else {
    //     activeSearch.style.width = "360px";
    // }
});

// ================================================== Above: Search Bar ===================================================


// =================================================== Below: Carousel ====================================================
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
// =================================================== Above: Carousel ====================================================


let popup = document.getElementById("popup");

function openPopup() {
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
}





// =============================================== BELOW: OLD BUTTONS CODE ================================================


// document.getElementById('addContactButton').addEventListener('click', function() {
//     document.getElementById('addContactPopup').style.display = 'block';
// });

// document.getElementById('closePopup').addEventListener('click', function() {
//     document.getElementById('addContactPopup').style.display = 'none';
// });

// document.getElementById('submitContact').addEventListener('click', function() {

//     document.getElementById('addContactPopup').style.display = 'none';
// });



// document.getElementById('contactsTable').addEventListener('click', function(event) {
//     if (event.target.classList.contains('edit-contact-button')) {
//         document.getElementById('editContactPopup').style.display = 'block';
		
//     } else if (event.target.classList.contains('delete-contact-button')) {
//         document.getElementById('deleteContactPopup').style.display = 'block';
//     }

// 	const selectedRow = event.target.closest('tr');
//     const contactName = selectedRow.querySelector('td:first-child').textContent;

//     [tableFirstName, tableLastName] = contactName.split(' ');
// });



// document.getElementById('closeEditPopup').addEventListener('click', function() {
//     document.getElementById('editContactPopup').style.display = 'none';
// });

// document.getElementById('closeDeletePopup').addEventListener('click', function() {
//     document.getElementById('deleteContactPopup').style.display = 'none';
// });

// document.getElementById('cancelDeleteContact').addEventListener('click', function() {
//     document.getElementById('deleteContactPopup').style.display = 'none';
// });

// document.getElementById('confirmDeleteContact').addEventListener('click', function() {
// 	deleteContact(tableFirstName, tableLastName);
//     document.getElementById('deleteContactPopup').style.display = 'none';
// });

// document.getElementById('saveEditContact').addEventListener('click', function() {
//     const editedFirstName = document.getElementById('editFirstName').value;
//     const editedLastName = document.getElementById('editLastName').value;
//     const editedEmail = document.getElementById('editEmail').value;

// 	editContact(tableFirstName, tableLastName, editedFirstName, editedLastName, editedEmail);

//     document.getElementById('editContactPopup').style.display = 'none';
// });

// function editContact(editFirstName, editLastName, newFirstName, newLastName, newEmailAddress){



// 	let tmp = {UserID:userId,SelectedFirstName:editFirstName,SelectedLastName:editLastName,NewFirstName:newFirstName, NewLastName:newLastName, NewEmailAddress:newEmailAddress};
// 	let jsonPayload = JSON.stringify( tmp );
	
// 	let url = urlBase + '/UpdateContact.' + extension;

// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				getContacts(search);
// 			}

// 		};
// 		xhr.send(jsonPayload);

// 	}
// 	catch(err)
// 	{
// 		console.error(err.message);
// 	}
// document.getElementById('addContactPopup').style.display = 'none';	
// }

// function deleteContact(deleteFirstName, deleteLastName){

// 	let tmp = {UserID:userId,FirstName:deleteFirstName,LastName:deleteLastName};
// 	let jsonPayload = JSON.stringify( tmp );
	
// 	let url = urlBase + '/DeleteContact.' + extension;

// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				getContacts(search);
// 			}

// 		};
// 		xhr.send(jsonPayload);

// 	}
// 	catch(err)
// 	{
// 		console.error(err.message);
// 	}
// }


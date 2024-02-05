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
                    searchFirstName = tempResult[0];
                    searchLastName = tempResult[1];
                    searchEmail = tempResult[2];
                    console.log(results);
                    
                    const row = document.createElement('tr');
                    // Second searchEmail is temp for phone numbers
                    row.innerHTML = `
						<td style="vertical-align: middle;">${searchFirstName}</td>
                        <td style="vertical-align: middle;">${searchLastName}</td>
						<td style="vertical-align: middle;">${searchEmail}</td>
						<td style="vertical-align: middle;">${searchEmail}</td>
                        <td style="text-align: center; vertical-align: middle">
                            <button class="bi bi-pencil-square" id="edit__button" onclick="openEditPopup('${searchFirstName}', '${searchLastName}', '${searchEmail}')"></button>
                            <button class="bi bi-trash3" id="delete__button" onclick="openDeletePopup('${searchFirstName}', '${searchLastName}')"></button>
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

// =================================================== Below: Popups ====================================================
let addPopup = document.getElementById("add__popup");
let editPopup = document.getElementById("edit__popup");
let deletePopup = document.getElementById("delete__popup");

function openAddPopup() {
    addPopup.classList.add("open-popup");
}

function openEditPopup(contactFirstName, contactLastName, contactEmail) {
    tableFirstName = contactFirstName;
    tableLastName = contactLastName;

    document.getElementById('edit__first__name__input').value = tableFirstName;
    document.getElementById('edit__last__name__input').value = tableLastName;
    document.getElementById('edit__email__input').value = contactEmail;
    document.getElementById('edit__phone__number__input').value = contactEmail;

    editPopup.classList.add("open-popup");

    // Change placeholder for inputs to be asscociated
    // first, last, phone number, and email
}

function openDeletePopup(contactFirstName, contactLastname) {
    tableFirstName = contactFirstName;
    tableLastName = contactLastname;

    deletePopup.classList.add("open-popup");
}

function submitAndClosePopup() {
    let contactFName = document.getElementById("first__name__input").value;
    let contactLName = document.getElementById("last__name__input").value;
    let contactEmail = document.getElementById("email__input").value;
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

    addPopup.classList.remove("open-popup");
}

function editAndClosePopup() {
    // Update changed information
    // Any unchagned information should not be blank
    let newFirstName = document.getElementById('edit__first__name__input').value;
    let newLastName = document.getElementById('edit__last__name__input').value;
    let newEmailAddress = document.getElementById('edit__email__input').value;

 	let tmp = {UserID:userId, SelectedFirstName:tableFirstName, SelectedLastName:tableLastName, NewFirstName:newFirstName, NewLastName:newLastName, NewEmailAddress:newEmailAddress};
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


    editPopup.classList.remove("open-popup");
}

function deleteAndClosePopup() {
    let tmp = {UserID:userId,FirstName:tableFirstName,LastName:tableLastName};
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

    deletePopup.classList.remove("open-popup");
}

// (Add Popup) Information not changed, only close popup
function closeAddPopup() {
    addPopup.classList.remove("open-popup");
}

// (Edit Popup) Information not changed, only close popup
function closeEditPopup() {
    editPopup.classList.remove("open-popup");
}

function closeDeletePopup() {
    deletePopup.classList.remove("open-popup");
}



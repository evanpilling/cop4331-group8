const urlBase = 'http://www.cop4331-group8.xyz/LAMPAPI';
const extension = 'php';
// =================================================== Above: API Links ===================================================


// =============================================== Below: Var Initalization ===============================================
let search = "";
let firstName = "";
let lastName = "";
let tableIndex = 0;

let tableFirstName = "";
let tableLastName = "";
// =============================================== Above: Var Initalization ===============================================


// =============================================== Below: Page Initalization ==============================================
document.addEventListener('DOMContentLoaded', function () {
    readCookie();
    getContacts(search, tableIndex);
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
function getContacts(searchFor, tableIndex) {

    const contactsTable = document.getElementById('contactsTable');
    let url = urlBase + '/SearchContact.' + extension;

    let tmp = { UserID: userId, Search: searchFor, Index: tableIndex};
    let jsonPayload = JSON.stringify(tmp);

    let searchFirstName = "";
    let searchLastName = "";
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
                    // Split obtained result by space FirstName LastName Email Phone
                    tempResult = results.split(' ');
                    searchFirstName = tempResult[0];
                    searchLastName = tempResult[1];
                    searchEmail = tempResult[2];
                    searchPhoneNumber = formatPhoneNumber(tempResult[3]);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
						<td style="vertical-align: middle;">${searchFirstName}</td>
                        <td style="vertical-align: middle;">${searchLastName}</td>
						<td style="vertical-align: middle;">${searchPhoneNumber}</td>
						<td style="vertical-align: middle;">${searchEmail}</td>
                        <td style="text-align: center; vertical-align: middle">
                            <button class="bi bi-pencil-square" id="edit__button" onclick="openEditPopup('${searchFirstName}', '${searchLastName}', '${searchEmail}', '${searchPhoneNumber}')"></button>
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

document.querySelector('.table-responsive').addEventListener('scroll', () => {
    const contactsTable = document.querySelector('.table-responsive');

    // -------------------------------------------------------------------------
    console.log("offset Height: " + contactsTable.offsetHeight);
    console.log("scroll Top: " + contactsTable.scrollTop);

    let added = (contactsTable.offsetHeight + contactsTable.scrollTop);

    console.log("offset and top: " + added);

    console.log("scroll Height: " + contactsTable.scrollHeight);
    // -------------------------------------------------------------------------

    if (contactsTable.offsetHeight + contactsTable.scrollTop >= contactsTable.scrollHeight) {
        tableIndex += 5;
        getContacts(search, tableIndex);
    }
});
// ================================================== Above: Data Table ===================================================


// ================================================== Below: Search Bar ===================================================

user__search.addEventListener("input", e => {
    tableIndex = 0;
    search = e.target.value;
    getContacts(search, tableIndex);
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

function openEditPopup(contactFirstName, contactLastName, contactEmail, contactPhoneNumber) {
    tableFirstName = contactFirstName;
    tableLastName = contactLastName;

    document.getElementById('edit__first__name__input').value = tableFirstName;
    document.getElementById('edit__last__name__input').value = tableLastName;
    document.getElementById('edit__email__input').value = contactEmail;
    document.getElementById('edit__phone__number__input').value = contactPhoneNumber;

    editPopup.classList.add("open-popup");

}

function openDeletePopup(contactFirstName, contactLastname) {
    tableFirstName = contactFirstName;
    tableLastName = contactLastname;

    deletePopup.classList.add("open-popup");
}

function submitAndClosePopup() {
    if (!validateInput(".contact__input")) {
        return;
    }
    let contactFName = document.getElementById("first__name__input").value;
    let contactLName = document.getElementById("last__name__input").value;
    let contactEmail = document.getElementById("email__input").value;
    let contactPhoneNumber = document.getElementById("phone__number__input").value.replace(/\D/g, '');
    let contactID = userId;


    let tmp = {FirstName:contactFName,LastName:contactLName,Email:contactEmail,Phone:contactPhoneNumber,UserID:contactID};
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
                getContacts(search, tableIndex);
            }

        };
        xhr.send(jsonPayload);

    }
    catch(err)
    {
        console.error(err.message);
    }

    document.getElementById("first__name__input").value = "";
    document.getElementById("last__name__input").value = "";
    document.getElementById("email__input").value = "";
    document.getElementById("phone__number__input").value = "";

    addPopup.classList.remove("open-popup");
}

document.querySelector('#phone__number__input').addEventListener('input', (e) => {
    let val = e.target.value;
    if (e.inputType === 'deleteContentBackward') {
        return; 
      }
    e.target.value = formatPhoneNumber(val);
})

function validateInput(query) {
    var validEmail = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+]*$/;
    let isValid = true;
    let phoneNumberLength = 14; // Length of a valid phone number in the format "(XXX) XXX-XXXX"

    document.querySelectorAll(query).forEach(inputElement => {
        if (inputElement.value.length === 0) {
            setInputError(inputElement, "This field is required")
            isValid = false;
        }
        else {
            switch (inputElement.id) {
                case "email__input":
                    if (!inputElement.value.match(validEmail)){
                        setInputError(inputElement, "Please enter a valid email address");
                        isValid = false;
                    }
                    break;
                case "phone__number__input":
                    if (!(inputElement.value.length == phoneNumberLength)) {
                        setInputError(inputElement, "Please enter a valid phone number");
                        isValid = false;
                    }
                    break;
                case "edit__email__input":
                    if (!inputElement.value.match(validEmail)){
                        setInputError(inputElement, "Please enter a valid email address");
                        isValid = false;
                    }
                    break;
                case "edit__phone__number__input":
                    if (!(inputElement.value.length == phoneNumberLength)) {
                        setInputError(inputElement, "Please enter a valid phone number");
                        isValid = false;
                    }
                    break;
            }
        }

    });

    return isValid;
}

function setInputError(inputElement, message) {
    inputElement.classList.add("contact__input--error");
    inputElement.nextElementSibling.textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("contact__input--error");
    inputElement.nextElementSibling.textContent = "";
}

document.querySelectorAll(".contact__input").forEach(inputElement => {
    inputElement.addEventListener("input", () => {
        clearInputError(inputElement);
    });
});

document.querySelectorAll(".contact__edit").forEach(inputElement => {
    inputElement.addEventListener("input", () => {
        clearInputError(inputElement);
    });
});

function editAndClosePopup() {
    if (!validateInput(".contact__edit")) {
        return;
    }
    
    let newFirstName = document.getElementById('edit__first__name__input').value;
    let newLastName = document.getElementById('edit__last__name__input').value;
    let newEmailAddress = document.getElementById('edit__email__input').value;
    let newPhoneNumber = document.getElementById('edit__phone__number__input').value.replace(/\D/g, '');

 	let tmp = {UserID:userId, SelectedFirstName:tableFirstName, SelectedLastName:tableLastName, NewFirstName:newFirstName, NewLastName:newLastName, NewEmailAddress:newEmailAddress, NewPhoneNumber:newPhoneNumber};
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
 				getContacts(search, tableIndex);
 			}
 		};
        
 		xhr.send(jsonPayload);

 	}
 	catch(err)
	{
		console.error(err.message);
 	}


     closeEditPopup();
}

document.querySelector('#edit__phone__number__input').addEventListener('input', (e) => {
    let val = e.target.value;
    if (e.inputType === 'deleteContentBackward') {
        return; 
      }
    e.target.value = formatPhoneNumber(val);
  })

function formatPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, '').substring(0, 10); // don't allow input if you've already input 10 numbers and strip all non-number characters
    
    return phoneNumber.replace(/(\d{1,3})(\d{1,3})?(\d{1,4})?/g, function(txt, f, s, t) {
        if (t) {
            return `(${f}) ${s}-${t}`;
        } else if (s) {
            return `(${f}) ${s}`;
        } else if (f) {
            return `(${f})`;
        }
    });
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
				getContacts(search, tableIndex);
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
    document.getElementById("first__name__input").value = "";
    document.getElementById("last__name__input").value = "";
    document.getElementById("email__input").value = "";
    document.getElementById("phone__number__input").value = "";

    document.querySelectorAll(".contact__input").forEach(inputElement => {
        clearInputError(inputElement);
    });

    addPopup.classList.remove("open-popup");
}

// (Edit Popup) Information not changed, only close popup
function closeEditPopup() {
    document.querySelectorAll(".contact__edit").forEach(inputElement => {
        clearInputError(inputElement);
    });

    editPopup.classList.remove("open-popup");
}

function closeDeletePopup() {
    deletePopup.classList.remove("open-popup");
}



const urlBase = 'http://www.cop4331-group8.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").innerHTML = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        userId = 0;
        firstName = "";
        lastName = "";
        
        let login = document.getElementById("loginUsername").value;
        let password = document.getElementById("loginPassword").value;
        
        if (login === "rickl" && password === "rickl") {
            easterEgg();
            return;
        }
        
        let tmp = {login:login,password:password};
        let jsonPayload = JSON.stringify( tmp );
        
        let url = urlBase + '/Login.' + extension;
    
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    userId = jsonObject.id;
            
                    if( userId < 1 )
                    {	
                        setFormMessage(loginForm, "error", "Invalid username/password combination");
                        return;
                    }
            
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;
  
                    saveCookie();
        
                    window.location.href = "landingPage.html";
                }

            };
            xhr.send(jsonPayload);

        }
        catch(err)
        {
            console.error(err.message);
        }

    });

    document.querySelectorAll("#createAccount .form__input").forEach(inputElement => {
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
    
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        if (!validateInput()) {
            return;
        }
        const registerFirstName = document.getElementById("signupFirstName").value;
        const registerLastName = document.getElementById("signupLastName").value;
        const registerUsername = document.getElementById("signupUsername").value;
        const registerEmail = document.getElementById("signupEmail").value;
        const registerPassword = document.getElementById("signupPassword").value;
    
    
        let tmp = {
            FirstName: registerFirstName,
            LastName: registerLastName,
            Login: registerUsername,
            Password: registerPassword,
            Email: registerEmail
        };
        
        let jsonPayload = JSON.stringify(tmp);
    
        let url = urlBase + '/Register.' + extension;
    
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error === "Login already exists") {
                        setInputError(document.getElementById("signupUsername"), "A user with this username already exists");
                        return;
                    }
                    setFormMessage(createAccountForm, "success", "Registration successful. You can now login.");
                }
                else 
                {
                    setFormMessage(createAccountForm, "error", "Registration failed. Please try again.");
                }
            };
            xhr.send(jsonPayload);
        } 
        catch (err) 
        {
            console.error(err.message);
        }
    });

    document.getElementById("signupPassword").addEventListener("input", function() {
        let password = this.value;
        let requirements = "";
    
        if (password.length < 8) {
            requirements += "• Password must be at least 8 characters<br>";
        }
    
        // Check for at least one number
        if (!/\d/.test(password)) {
            requirements += "• Password must contain at least one number<br>";
        }
    
        // Check for at least one special character
        if (!/[!@#$%^&*]/.test(password)) {
            requirements += "• Password must contain at least one special character";
        }
    
        if (requirements) {
            setInputError(this, requirements);
        } else {
            clearInputError(this);
        }
    });

    function validateInput()
    {
        let validEmail = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+]*$/;
        let validPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        let isValid = true;
        let signupPassword = document.getElementById("signupPassword");
        let confirmPassword = document.getElementById("confirmPassword");

        document.querySelectorAll("#createAccount .form__input").forEach(inputElement => {
            if (inputElement.value.length === 0) {
                setInputError(inputElement, "This field is required");
                isValid = false;
            }
            else 
            {
                if (inputElement.id === "signupUsername" && (inputElement.value.length < 6)) {
                    setInputError(inputElement, "Username must be at least 6 characters in length");
                    isValid = false;
                }
        
                if (inputElement.id === "signupEmail" && !inputElement.value.match(validEmail)) {
                    setInputError(inputElement, "Please enter a valid email address");
                    isValid = false;
                }

                if (inputElement.id === "signupPassword" && !inputElement.value.match(validPassword)) {
                    isValid = false; // Setting input error handled by event listener
                }
                
                if (inputElement.id === "confirmPassword" && (signupPassword.value !== confirmPassword.value) && (signupPassword.value !== "") && (confirmPassword.value !== "")) {
                    setInputError(document.getElementById("signupPassword"), "");
                    setInputError(document.getElementById("confirmPassword"), "Passwords must match");
                    isValid = false;
                }

            }

        });

        return isValid;
    }
});



function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

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
		document.getElementById("loginUsername").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function easterEgg() {
    let easterEgg = document.getElementById('easter__shark');
    easterEgg.style.visibility = "visible";
    easterEgg.style.animation = "myShark 10s";
    const targetTime = new Date().getTime() + 9000;
    stallUntil(targetTime, easterEgg);
}

function stallUntil(time, easterEgg) {
    const currentTime = new Date().getTime();
    const delay = time - currentTime;

    if (delay > 0) {
        setTimeout(() => {
            easterEgg.style.visibility = "hidden";
            easterEgg.style.animation = "none";
        }, delay);
    } else {
        console.log("Specified time has already passed.");
    }
}

document.getElementById('linkCreateAccount').addEventListener('click', () => {
    document.getElementById('brand__name').style.top = '1rem';
    document.getElementById('brand__name').style.textShadow = '1px 1px 10px #fff, 1px 1px 20px #fff, 1px 1px 30px #fff, 1px 1px 40px #fff';
    document.getElementById('brand__name').style.color = '#000000';
});



document.getElementById('linkLogin').addEventListener('click', () => {
    document.getElementById('brand__name').style.top = '12rem';
    document.getElementById('brand__name').style.textShadow = '1px 1px 10px #000000, 1px 1px 20px #000000, 1px 1px 30px #000000, 1px 1px 40px #000000';
    document.getElementById('brand__name').style.color = '#fff';
});
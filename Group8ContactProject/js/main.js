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
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
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

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 6) {
                setInputError(inputElement, "Username must be at least 6 characters in length")
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
    
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
    
        const registerFirstName = document.getElementById("signupFirstName").value;
        const registerLastName = document.getElementById("signupLastName").value;
        const registerUsername = document.getElementById("signupUsername").value;
        const registerEmail = document.getElementById("signupEmail").value;
        const registerPassword = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
    
        if (registerPassword !== confirmPassword) {
            setFormMessage(createAccountForm, "error", "Passwords do not match");
            return;
        }
    
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



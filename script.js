/*-----------------------------------------Database-----------------------------------------*/
const firebaseConfig = {
    apiKey: "AIzaSyB3W7viPxk2IRD8zkhk_DG9vRgA2bUia9s",
    authDomain: "techfoods-68990.firebaseapp.com",
    projectId: "techfoods-68990",
    storageBucket: "techfoods-68990.appspot.com",
    messagingSenderId: "366074111407",
    appId: "1:366074111407:web:190b198504f482a27afb5a",
    measurementId: "G-L1KSVN1079"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

/*-----------------------------------------Register Button-----------------------------------------*/
var registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", function(event){
    event.preventDefault()  

    //Assign user input to vairables
    name = document.getElementById("name").value;
    surname= document.getElementById("surname").value;
    email = document.getElementById("email").value;
    contact = document.getElementById("contact").value.trim(); //trim gets rid of any extra spaces in the textbox.
    password = document.getElementById("password").value;

    try{
        if (!/^\d{10}$/.test(contact)) { //validate phone number to = 10 digits
            throw new Error("Contact number must be 10 digits long.");
        }
    } 
    catch(error){
        DisplayError(error); //display error
        return; //"return;" stops the code from running further as it ran into an error
    }

    auth.createUserWithEmailAndPassword(email, password) //Authentication on Firebase
    .then(function() { //Adding data to Realtime Database
        var user = auth.currentUser
        var database_ref = database.ref()
        var user_data = {
            name : name,
            surname : surname,
            email : email,
            contact : contact
        }
        database_ref.child("users/" + user.uid).set(user_data) //Add user data under node "users/" in Realtime Database

        Swal.fire({ //Alert Success Registration
            title: "Thank you for signing up for Tech<span> Foods</span>!",
            text: "Your interest in joining our community is appreciated!",
            color: "#ffffff",
            icon: "success",
            confirmButtonColor: "#ff3333",
            iconColor: "#ff3333",
            confirmButtonText: "Okay"
        }).then((result) => { //Once the window is closed, redirect user to login.html
            if (result.isConfirmed) {
                window.location.href = "login.html";
            }
        });
    }).catch(DisplayError) //display any error that might occur when registering (password, email, etc)
});

/*-----------------------------------------Functions-----------------------------------------*/
function DisplayError(error){ //Display Error Method
    var errorMessage = error.message; //assigning error message to var

    Swal.fire({ //Alert box Error
        title: "Error:",
        text: errorMessage + " ",
        color: "#ffffff",
        icon: "error"
    });
}
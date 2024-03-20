/*-----------------------------------------Database Connection-----------------------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyB3W7viPxk2IRD8zkhk_DG9vRgA2bUia9s",
  authDomain: "techfoods-68990.firebaseapp.com",
  projectId: "techfoods-68990",
  storageBucket: "techfoods-68990.appspot.com",
  messagingSenderId: "366074111407",
  appId: "1:366074111407:web:190b198504f482a27afb5a",
  measurementId: "G-L1KSVN1079",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

document.querySelector(".loginbtn").textContent = localStorage.getItem("userID") || "Login";

document.addEventListener("DOMContentLoaded", function () {
  // Event listener for the parent element containing both forms
  document.body.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    /*-----------------------------------------Register Button-----------------------------------------*/
    // Check if the submitted form is the registration form
    if (event.target.id === "registrationForm") {
      //Assign user input to vairables
      name = document.getElementById("name").value;
      surname = document.getElementById("surname").value;
      email = document.getElementById("email").value.trim();
      contact = document.getElementById("contact").value.trim(); //trim gets rid of any extra spaces in the textbox.
      password = document.getElementById("password").value;

      try {
        if (!/^\d{10}$/.test(contact)) {
          //validate phone number to = 10 digits
          throw new Error("Contact number must be 10 digits long.");
        }
      } catch (error) {
        DisplayError(error); //display error
        return; //"return;" stops the code from running further as it ran into an error
      }

      auth.createUserWithEmailAndPassword(email, password) //Authentication on Firebase
        .then(function () {
          //Adding data to Realtime Database
          var user = auth.currentUser;
          var database_ref = database.ref();
          var currentDate = new Date();
          var formattedDate = currentDate.toLocaleString();

          var user_data = {
            name: name,
            surname: surname,
            email: email,
            contact: contact,
            last_login: formattedDate,
          };
          database_ref.child("users/" + user.uid).set(user_data); //Add user data under node "users/" in Realtime Database

          Swal.fire({
            //Alert Success Registration
            title: "Thank you for signing up for Tech Foods!",
            text: "Your interest in joining our community is appreciated!",
            color: "#ffffff",
            icon: "success",
            confirmButtonColor: "var(--text-color)",
            iconColor: "var(--text-color)",
            confirmButtonText: "Okay",
          }).then((result) => {
            //Once the window is closed, redirect user to login.html
            if (result.isConfirmed) {
              window.location.href = "login.html";
            }
          });
        })
        .catch(DisplayError); //display any error that might occur when registering (password, email, etc)

    } /*-----------------------------------------Login Button-----------------------------------------*/
    // Check if the submitted form is the login form
    if (event.target.id === "loginForm") {
      //Assign user input to vairables
      email = document.getElementById("email").value.trim();
      password = document.getElementById("password").value;

      auth.signInWithEmailAndPassword(email, password) //Authentication on Firebase
        .then(function () {
          //Adding data to Realtime Database
          var user = auth.currentUser;
          var database_ref = database.ref();
          var currentDate = new Date();
          var formattedDate = currentDate.toLocaleString();

          var user_data = {
            last_login: formattedDate,
          };
          database_ref.child("users/" + user.uid).update(user_data); //update user data under node "users/" in Realtime Database

          Swal.fire({
            //Alert Success Registration
            title: "Thank you for logging in!",
            color: "#ffffff",
            icon: "success",
            confirmButtonColor: "var(--text-color)",
            iconColor: "var(--text-color)",
            confirmButtonText: "Okay",
            allowOutsideClick: false,
          }).then((result) => {
            //Once the window is closed, redirect user to index.html
            if (result.isConfirmed) {
              localStorage.setItem("userID", user.uid)
              window.location.href = "index.html";
            }
          });
        })
        .catch(DisplayError); //display any error that might occur when registering (password, email, etc)
    }
    if (event.target.id === "reservationForm") {
      /*---------------------------------Reservation page------------------------------*/
      document.getElementById("reservationForm").addEventListener("submit", function(event) {
        event.preventDefault();
      
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var datetime = document.getElementById("datetime").value;
        var people = document.getElementById("people").value;
      
        alert("Reservation Details:\nName: " + name + "\nEmail: " + email + "\nDate & Time: " + datetime + "\nNumber of People: " + people);
      
        document.getElementById("reservationForm").reset();
      });
      var now = new Date();
      now.setHours(10); 
      var minDateTime = now.toISOString().slice(0, 16); 
      document.getElementById("datetime").setAttribute("min", minDateTime);
    }
  });
});
/*-----------------------------------------Functions-----------------------------------------*/
function DisplayError(error) {
  //Display Error Method
  var errorMessage = error.message; //assigning error message to var
  if (errorMessage == '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}') 
  {
    errorMessage = "Invalid Email or Password."; //more readable error message for user
  }
  Swal.fire({
    //Alert box Error
    title: "Error:",
    text: errorMessage + " ",
    color: "#ffffff",
    icon: "error",
    confirmButtonText: "Okay",
    iconColor: "var(--text-color)",
    confirmButtonColor: "var(--text-color)",
  });
  return;
}

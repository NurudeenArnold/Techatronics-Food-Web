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

  // Event listener for the parent element containing both forms
document.addEventListener("DOMContentLoaded", function () {
  let loginButton = document.querySelector(".loginbtn");
  let loginText = localStorage.getItem("userName") || "Login";
  loginButton.textContent = loginText.trim();

  if (loginText.length > 8) {
    loginText = loginText.substring(0, 8) + "...";
  }
  loginButton.textContent = loginText;

  if (loginText !== "Login") {
    loginButton.href = "userProfile.html";
    console.log(loginButton.href);
  } else {
    console.log(loginText);
  }
     /*---------------------------------Image slidewhow----------------------------------------*/
     if (window.location.pathname.includes('/index.html') || window.location.pathname === '/') {
      var images = document.querySelectorAll('#overlay img');
      var current = 0;
      
      function nextSlide() {
      
          images[current].style.display = 'none';
       
          current = (current + 1) % images.length;
         
          images[current].style.display = 'block';
      }
      
      
      images[current].style.display = 'block';
      
      
      setInterval(nextSlide, 2000);
    }

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
            if (result.isConfirmed) {//Once the window is confirmed ("okay" was clicked), run this code
              const userNameRef = database_ref.child("users/" + user.uid + "/name"); //database ref
              userNameRef.on('value', (snapshot) => {
                const userName = snapshot.val(); 
                localStorage.setItem("userName", userName) //local storage for name
                console.log("idanoida" + user.uid)
                localStorage.setItem("userID", user.uid)
                window.location.href = "index.html"; //redirect user to home page
              }, (error) => {
                console.error("Error retrieving user's name:", error);
              });
            }
          });
        })
        .catch(DisplayError); //display any error that might occur when registering (password, email, etc)
    }
    /*---------------------------------Reservation page------------------------------*/
    if (event.target.id === "reservationForm") {
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
/*-----------------------------------------Responsive Navbar-----------------------------------------*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');
        if(top >= offset && top < offset + height){
            navLinks.forEach (link => {
                link.classList.remove('active');
            });
            document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
        }
    });
};


/*-----------------------------------Icon drop down menu function------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
  var profileImage = document.getElementById("profile-image");
  var dropdownMenu = document.getElementById("dropdown-menu");

  // Toggle dropdown menu visibility when profile icon is clicked
  profileImage.addEventListener("click", function(event) {
    dropdownMenu.classList.toggle("show");
    event.stopPropagation(); // Prevent the click event from bubbling up
  });

  // Close dropdown menu when clicking outside of the icon or dropdown menu
  document.body.addEventListener("click", function() {
    dropdownMenu.classList.remove("show");
  });

  // Prevent the dropdown menu from closing when clicking inside it
  dropdownMenu.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the click event from bubbling up
  });
});

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

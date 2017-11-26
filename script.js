// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcy8K3wtS-Qa0WS2VPNzd9hSEeNtCB57Q",
    authDomain: "hair-9e91b.firebaseapp.com",
    databaseURL: "https://hair-9e91b.firebaseio.com",
    projectId: "hair-9e91b",
    storageBucket: "hair-9e91b.appspot.com",
    messagingSenderId: "242280081716"
};
firebase.initializeApp(config);

// HTML elements
var txtEmail = $("#inputEmail");
var txtPassword = $("#inputPassword");
var btnLogin = $("#btnLogin");
var btnSignUp = $("#btnSignUp");
var btnLogout = $("#btnLogout");

// Log in event
$(btnLogin).click(function () {
    console.log('btn clicked');
    // Get email and pass
    var email = $(txtEmail).val();
    var password = $(txtPassword).val();
    var auth = firebase.auth();

    // Sign in
    var promise = auth.signInWithEmailAndPassword(email, password);
    promise
        .catch(function (e) {
            console.log(e.message);
        })
});

// Sign Up event
$(btnSignUp).click(function () {
    console.log('btn clicked');
    // Get email and pass
    // TODO: verify email
    var email = $(txtEmail).val();
    var password = $(txtPassword).val();
    var auth = firebase.auth();

    // Sign in
    var promise = auth.createUserWithEmailAndPassword(email, password);
    promise
        .catch(function (e) {
            console.log(e.message);
        })
});

// Sign out event
$(btnLogout).click(function () {
    firebase.auth().signOut();
});


// Real-time listener
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        $('#statusMsg').text('User logged in: ' + firebaseUser.email);
        console.log('firebaseUser is : ', firebaseUser);
        showLoginElems(false);
    } else {
        $('#statusMsg').text('Please Log in');
        console.log('Not logged in');
        showLoginElems(true);
    }
});

// Toggle Login elements
function showLoginElems(showLoginFlag) {
    if (showLoginFlag) {
        $('#inputEmail').show();
        $('#inputPassword').show();
        $('#btnLogin').show();
        $('#btnSignUp').show();
        $('#btnLogout').hide();
    } else {
        $('#inputEmail').hide();
        $('#inputPassword').hide();
        $('#btnLogin').hide();
        $('#btnSignUp').hide();
        $('#btnLogout').show();
    }
}
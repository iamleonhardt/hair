// Global Vars
var currentCut;
var file;
var user;


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
var database = firebase.database();
var storage = firebase.storage();

// HTML elements
var txtEmail = $("#inputEmail");
var txtPassword = $("#inputPassword");
var btnLogin = $("#btnLogin");
var btnSignUp = $("#btnSignUp");
var btnLogout = $("#btnLogout");

var uploadElems = $("#uploadsContainer");
var newCutButton = $("#newCutButton");
var uploader = $("#uploader");
var fileButton = $("#fileButton");
var image = $("#image");

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
        .then(function (firebaseUser) {
            console.log('signed up and user is : ', firebaseUser);
            var userIDRef = database.ref('users/' + firebaseUser.uid)
            userIDRef.set({
                email: firebaseUser.email
            })
        })
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
        user = firebaseUser;
        showLoginElems(false);
        showUploadElems(true);
        displayCuts();
    } else {
        $('#statusMsg').text('Please Log in');
        console.log('Not logged in');
        showLoginElems(true);
        showUploadElems(false);
        user = null;
    }
});

// Toggle Login elements
function showLoginElems(showLoginFlag) {
    if (showLoginFlag) {
        $(txtEmail).show();
        $(txtPassword).show();
        $(btnLogin).show();
        $(btnSignUp).show();
        $(btnLogout).hide();
    } else {
        $(txtEmail).hide();
        $(txtPassword).hide();
        $(btnLogin).hide();
        $(btnSignUp).hide();
        $(btnLogout).show();
    }
}

// Toggle Upload elements
function showUploadElems(showUploadFlag) {
    if (showUploadFlag) {
        $(uploadElems).show();
    } else {
        $(uploadElems).hide();
    }
}

// Create new cut entry
$(newCutButton).click(function () {
    console.log('new cut clicked');
    var cutsRef = database.ref('users/' + user.uid + '/cuts').push();
    var key = cutsRef.key;
    console.log('key is : ', key);
    cutsRef.set({images: 'test'});
    currentCut = key;
});

// Listen for file selection
$(fileButton).change(function (e) {
    var file = e.target.files[0];
    var storageRef = storage.ref('images/' + file.name);
    var task = storageRef.put(file);

    // Update the progress bar
    task.on('state_changed',
        // State change events
        function (snapshot) {
            console.log('snapshot is: ', snapshot);
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.val(percentage);
        },

        // Error during upload
        function (err) {

        },
        // Successful upload
        function () {
            var downloadURL = task.snapshot.downloadURL;
            console.log('success and : ', task);

            var imageRef = database.ref('users/' + user.uid + '/cuts/' + currentCut + '/images');
            imageRef.push().set(
                downloadURL
            );

            $(image).prepend('<img id="newImage" src="' + downloadURL + '" />')
        }
    )
});


// Add all cuts to page
function displayCuts() {
    var cutsRef = database.ref('users/' + user.uid + '/cuts/')
    cutsRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log('childSnapshot is: ', childSnapshot);
            // var imageRef = database.ref('users/' + user.uid + '/cuts/' + childSnapshot.key + '/images')
            // imageRef.forEach(function(imagesSnapshot){
            //     console.log('imagesSnapshot is : ', imagesSnapshot);
            //     $(image).prepend('<img id="newImage" src="' + imagesSnapshot + '" />')
            // });

            $(image).prepend($('<div>', {
                    class: "cutDetails",
                    text: childSnapshot.key
                })
            );

            // console.log('childSnapshot is: ', childSnapshot.key);
        })
    })
}



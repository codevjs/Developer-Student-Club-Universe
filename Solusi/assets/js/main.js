// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const config = {
    apiKey: "AIzaSyA_lckINTLSBmnVoHzADr11SYdoYZPHDvE",
    authDomain: "dscu-cd1e3.firebaseapp.com",
    projectId: "dscu-cd1e3",
    storageBucket: "dscu-cd1e3.appspot.com",
    messagingSenderId: "838104484904",
    appId: "1:838104484904:web:f9e193e794344666c9391d",
    measurementId: "G-4RLQ97JWXN"
};

// Initialize Firebase
firebase.initializeApp(config);
const analytics =  firebase.analytics();

let session = Cookies.get("session");

const logout = document.querySelector("#logout");

if (session !== undefined) {

    logout.style.display = "inline";

    logout.addEventListener("click",  async () => {

        await firebase.auth().signOut();

        Cookies.remove("session");

        window.location.reload();
    })
} else {

    logout.style.display = "none";
}
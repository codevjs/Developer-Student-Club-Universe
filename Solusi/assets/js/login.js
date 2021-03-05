const user = Cookies.get('session');

if (user !== undefined) window.location.href = "/create.html";

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            Cookies.set('session', JSON.stringify(authResult.user), { expires: 7 });
            return true;
        },

    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/create.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
};

ui.start('#firebaseui-auth-container', uiConfig);

const form = document.querySelector("form");
const btnSubmit = document.querySelector("#button-submit");

form.addEventListener("submit", async event => {
    try {

        btnSubmit.textContent = "Loading...";
        btnSubmit.disabled = true;

        event.preventDefault();

        let {email, password}  = event.target;

        let authResult = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);

        Cookies.set('session', JSON.stringify(authResult.user), { expires: 7 });

        window.location.href = "/create.html";

    } catch (e) {

        window.alert(e.message);

    } finally {

        btnSubmit.textContent = "Masuk";
        btnSubmit.disabled = false;
    }
})
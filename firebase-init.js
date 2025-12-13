// This file contains the Firebase configuration and initializes the Firebase app.
// It should be included in every HTML file that uses Firebase services.

const firebaseConfig = {
    apiKey: "AIzaSyBHc4QygGxRb8HNQSL3S4eo9QcRCYPBDLQ", // It's better to use environment variables for this
    authDomain: "to-do-for-school-ee688.firebaseapp.com",
    projectId: "to-do-for-school-ee688",
    storageBucket: "to-do-for-school-ee688.appspot.com",
    messagingSenderId: "890456526492",
    appId: "1:890456526492:web:30ba2e598b5df8be4b6759",
    measurementId: "G-LT1ZCLB5E5"
};

// Initialize Firebase only if it hasn't been initialized yet.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
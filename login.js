document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Setup ---
    const firebaseConfig = {
        apiKey: "AIzaSyBHc4QygGxRb8HNQSL3S4eo9QcRCYPBDLQ",
        authDomain: "to-do-for-school-ee688.firebaseapp.com",
        projectId: "to-do-for-school-ee688",
        storageBucket: "to-do-for-school-ee688.appspot.com",
        messagingSenderId: "890456526492",
        appId: "1:890456526492:web:30ba2e598b5df8be4b6759",
        measurementId: "G-LT1ZCLB5E5"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // -- Redirect if already logged in --
    // This checks the user's auth state as soon as the page loads.
    auth.onAuthStateChanged(user => {
        if (user) {
            // If a user is found, it means they are already logged in.
            window.location.href = 'tasks.html';
        }
        // If no user, the rest of the script will run and show the login form.
    });

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login');
    const errorMessageDiv = document.getElementById('error-message');
    const guestLoginBtn = document.getElementById('guest-login-btn');
    const googleLoginBtn = document.getElementById('google-signin-btn-login');
    const googleSignupBtn = document.getElementById('google-signin-btn-signup');

    // Switch between forms
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        signupForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        loginForm.classList.remove('hidden');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        resetPasswordForm.classList.remove('hidden');
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        loginForm.classList.remove('hidden');
    });

    // Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Validate inputs
        if (!email) {
            showError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }
        if (!isValidEmail(email)) {
            showError('الرجاء إدخال بريد إلكتروني صحيح.');
            return;
        }
        if (!password) {
            showError('الرجاء إدخال كلمة المرور.');
            return;
        }

        setButtonLoading(submitBtn, true);
        errorMessageDiv.classList.add('hidden');

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                window.location.href = 'tasks.html';
            })
            .catch((error) => {
                setButtonLoading(submitBtn, false);
                let errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'كلمة المرور غير صحيحة.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'البريد الإلكتروني غير صحيح.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'تم تجاوز عدد المحاولات المسموح به. يرجى المحاولة لاحقاً.';
                }
                showError(errorMessage);
            });
    });

    // Handle Signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const submitBtn = signupForm.querySelector('button[type="submit"]');

        // Validate inputs
        if (!email) {
            showError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }
        if (!isValidEmail(email)) {
            showError('الرجاء إدخال بريد إلكتروني صحيح.');
            return;
        }
        if (!password) {
            showError('الرجاء إدخال كلمة المرور.');
            return;
        }
        if (!isValidPassword(password)) {
            showError('كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل.');
            return;
        }

        setButtonLoading(submitBtn, true);
        errorMessageDiv.classList.add('hidden');

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up and signed in
                window.location.href = 'tasks.html';
            })
            .catch((error) => {
                setButtonLoading(submitBtn, false);
                let errorMessage = 'حدث خطأ ما. قد يكون البريد الإلكتروني مستخدماً بالفعل.';
                if (error.code === 'auth/weak-password') {
                    errorMessage = 'كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل.';
                } else if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'البريد الإلكتروني غير صحيح.';
                }
                showError(errorMessage);
            });
    });

    // Handle Guest Login
    guestLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const originalText = guestLoginBtn.textContent;
        guestLoginBtn.disabled = true;
        guestLoginBtn.textContent = 'جاري الدخول...';

        auth.signInAnonymously()
            .then(() => {
                window.location.href = 'tasks.html';
            })
            .catch((error) => {
                guestLoginBtn.disabled = false;
                guestLoginBtn.textContent = originalText;
                let errorMessage = "حدث خطأ أثناء محاولة الدخول كزائر.";
                if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = 'الدخول كزائر غير مفعّل حالياً.';
                }
                showError(errorMessage);
            });
    });

    // Handle Password Reset
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value.trim();
        const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');

        // Validate inputs
        if (!email) {
            showError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }
        if (!isValidEmail(email)) {
            showError('الرجاء إدخال بريد إلكتروني صحيح.');
            return;
        }

        setButtonLoading(submitBtn, true);
        hideAllForms();
        resetPasswordForm.classList.remove('hidden');

        auth.sendPasswordResetEmail(email)
            .then(() => {
                hideAllForms();
                loginForm.classList.remove('hidden');
                showError('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.', 'success');
            })
            .catch((error) => {
                setButtonLoading(submitBtn, false);
                hideAllForms();
                resetPasswordForm.classList.remove('hidden');
                let errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'البريد الإلكتروني غير صحيح.';
                }
                showError(errorMessage);
            });
    });

    // Handle Google Sign-In
    const handleGoogle = (button) => {
        if (!button) return;
        errorMessageDiv.classList.add('hidden');
        setButtonLoading(button, true);

        auth.signInWithPopup(googleProvider)
            .then(() => {
                window.location.href = 'tasks.html';
            })
            .catch((error) => {
                setButtonLoading(button, false);
                let errorMessage = 'تعذر تسجيل الدخول عبر Google. حاول لاحقاً.';
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'تم إغلاق نافذة Google قبل إكمال التسجيل.';
                } else if (error.code === 'auth/cancelled-popup-request') {
                    errorMessage = 'هناك محاولة تسجيل أخرى جارية. حاول مجدداً.';
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    errorMessage = 'يوجد حساب بنفس البريد بطريقة تسجيل مختلفة. سجّل بالطريقة السابقة ثم اربطه بـ Google.';
                }
                showError(errorMessage);
            });
    };

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGoogle(googleLoginBtn);
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGoogle(googleSignupBtn);
        });
    }

    function hideAllForms() {
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        resetPasswordForm.classList.add('hidden');
        errorMessageDiv.classList.add('hidden');
    }

    function showError(message, type = 'error') {
        errorMessageDiv.textContent = message;
        errorMessageDiv.className = `error-message ${type === 'success' ? 'success-message' : ''}`;
        errorMessageDiv.classList.remove('hidden');
    }

    // Helper function to set button loading state
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalHTML = button.innerHTML;
            button.innerHTML = '<span class="loading-spinner"></span> جاري المعالجة...';
        } else {
            button.disabled = false;
            if (button.dataset.originalHTML) {
                button.innerHTML = button.dataset.originalHTML;
                delete button.dataset.originalHTML;
            }
        }
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to validate password
    function isValidPassword(password) {
        return password.length >= 6;
    }
});
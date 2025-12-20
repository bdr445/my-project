document.addEventListener('DOMContentLoaded', () => {
    // Firebase is initialized in firebase-init.js
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    let functions = null;
    if (typeof firebase.functions === 'function') {
        try { functions = firebase.functions(); } catch (e) { functions = null; }
    }

    // --- reCAPTCHA Setup ---

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

    loginForm.addEventListener('submit', async (e) => { // *** تأكد من وجود async هنا

        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();

        const password = document.getElementById('login-password').value;

        const submitBtn = loginForm.querySelector('button[type="submit"]');



        // 1. Validate inputs (التحقق من صحة المدخلات)

        if (!email || !isValidEmail(email) || !password) {

            if (!email) showError('الرجاء إدخال البريد الإلكتروني.');

            else if (!isValidEmail(email)) showError('الرجاء إدخال بريد إلكتروني صحيح.');

            else if (!password) showError('الرجاء إدخال كلمة المرور.');

            return;

        }



        setButtonLoading(submitBtn, true);

        errorMessageDiv.classList.add('hidden');



        // --- 2. تنفيذ reCAPTCHA والحصول على الرمز المميز والتحقق في الخلفية (Backend) ---

        try {

            // 2a. الحصول على رمز reCAPTCHA المميز
            const recaptchaToken = await grecaptcha.enterprise.execute('6LdxliUsAAAAAOH1QPdoEBa4nYH1qips2gVvbXTt', { action: 'login' });


            // 2b. استدعاء دالة الخادم (Cloud Function) للتحقق من الرمز المميز
            let verified = false;
            if (functions && typeof functions.httpsCallable === 'function') {
                const verifyFunction = functions.httpsCallable('verifyRecaptcha');
                const result = await verifyFunction({ recaptchaToken: recaptchaToken, action: 'login' });
                verified = !!(result && result.data && result.data.success);
            } else {
                // If functions SDK or cloud function not available, skip server-side reCAPTCHA verification.
                // This keeps the login page functioning locally when the functions SDK isn't included.
                verified = true;
            }

            if (verified) {
                // Proceed with sign-in
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
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
            } else {
                setButtonLoading(submitBtn, false);
                showError('فشل التحقق الأمني. الرجاء المحاولة مرة أخرى.');
            }

        } catch (e) {

            setButtonLoading(submitBtn, false);

            // هذا الخطأ يمكن أن يكون من reCAPTCHA أو من فشل الاتصال بالـ Cloud Function
            showError('حدث خطأ أثناء الاتصال بنظام الأمان. حاول مجدداً.');

            console.error("reCAPTCHA or Function Call Error:", e);

        }

    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => { // *** أضف async هنا
        e.preventDefault();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const submitBtn = signupForm.querySelector('button[type="submit"]');

        // 1. Validate inputs (هذه الخطوة موجودة بالفعل)
        if (!email || !isValidEmail(email) || !password || !isValidPassword(password)) {
            // ... (كود التحقق الخاص بك) ...
            return;
        }

        setButtonLoading(submitBtn, true);
        errorMessageDiv.classList.add('hidden');

        // --- 2. تنفيذ reCAPTCHA والحصول على الرمز المميز (Token) ---
        try {
            const recaptchaToken = await grecaptcha.enterprise.execute('6LdxliUsAAAAAOH1QPdoEBa4nYH1qips2gVvbXTt', { action: 'signup' });
            // **ملاحظة:** هنا يجب أن يتم إرسال `recaptchaToken` إلى الباك إند للتحقق.
            // (انظر الملاحظة في قسم تسجيل الدخول)

            // 3. المتابعة بعملية إنشاء الحساب في Firebase
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up and signed in
                    window.location.href = 'tasks.html';
                })
                .catch((error) => {
                    setButtonLoading(submitBtn, false);
                    // ... (كود معالجة الأخطاء الخاص بك) ...
                });
        } catch (e) {
            setButtonLoading(submitBtn, false);
            showError('حدث خطأ أثناء التحقق من الأمان. حاول مجدداً.');
            console.error("reCAPTCHA Error:", e);
        }
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
            const loadingText = (window.I18N && I18N.t) ? I18N.t('login', 'processing') : 'جاري المعالجة...';
            button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
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
document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Setup (copied from script.js for settings page context) ---
    const firebaseConfig = {
        apiKey: "AIzaSyBHc4QygGxRb8HNQSL3S4eo9QcRCYPBDLQ",
        authDomain: "to-do-for-school-ee688.firebaseapp.com",
        projectId: "to-do-for-school-ee688",
        storageBucket: "to-do-for-school-ee688.appspot.com",
        messagingSenderId: "890456526492",
        appId: "1:890456526492:web:30ba2e598b5df8be4b6759",
        measurementId: "G-LT1ZCLB5E5"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- DOM Elements ---
    const colorSwatchesContainer = document.getElementById('color-swatches');
    const backgroundSwatchesContainer = document.getElementById('background-swatches');
    const customBgInput = document.getElementById('custom-bg-input');
    const customBgStatus = document.getElementById('custom-bg-status');
    const languageSelect = document.getElementById('language-select');

    let currentUser = null;

    // --- Auth State ---
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadAndApplySettings(user);
        } else {
            // If no user, redirect to login. Settings page requires a user.
            window.location.href = 'login.html';
        }
    });

    // Load settings from Firestore/localStorage and update the UI
    const loadAndApplySettings = async (user) => {
        let settings = {};
        if (user && !user.isAnonymous) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    settings = doc.data().settings || {};
                }
            } catch (error) {
                console.error("Error loading settings from Firestore:", error);
            }
        }

        // Use Firestore settings, or fallback to localStorage, or finally to default values.
        const primaryColor = settings.primaryColor || localStorage.getItem('primaryColor') || '#0078d4';
        const backgroundImage = settings.backgroundImage || localStorage.getItem('backgroundImage') || 'images/background.jpg';
        const language = settings.language || localStorage.getItem('language') || 'ar';
        if (window.I18N) {
            I18N.set(language);
            I18N.applySettingsPage();
        }

        // Apply color
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        colorSwatchesContainer.querySelector('.active')?.classList.remove('active');
        const activeColorSwatch = document.querySelector(`.swatch[data-color="${primaryColor}"]`);
        if (activeColorSwatch) activeColorSwatch.classList.add('active');

        // Apply background (only for marking active swatch, not changing page bg)
        backgroundSwatchesContainer.querySelector('.active')?.classList.remove('active');
        const activeBgSwatch = document.querySelector(`.bg-swatch[data-bg="${backgroundImage}"]`);
        if (activeBgSwatch) activeBgSwatch.classList.add('active');

        if (languageSelect) languageSelect.value = language;
    };

    /**
     * A robust function to update a setting.
     * It updates the UI, localStorage, and Firestore in the correct order.
     * @param {string} key - The setting key (e.g., 'primaryColor').
     * @param {string} value - The new value for the setting.
     */
    const updateSetting = async (key, value) => {
        if (!key || value === undefined) return;

        // 1. Update localStorage immediately for cross-page consistency.
        localStorage.setItem(key, value);

        // 2. Update the UI visually.
        if (key === 'primaryColor') {
            document.documentElement.style.setProperty('--primary-color', value);
            colorSwatchesContainer.querySelector('.active')?.classList.remove('active');
            colorSwatchesContainer.querySelector(`[data-color="${value}"]`)?.classList.add('active');
        } else if (key === 'backgroundImage') {
            backgroundSwatchesContainer.querySelector('.active')?.classList.remove('active');
            const activeSwatch = backgroundSwatchesContainer.querySelector(`[data-bg="${value}"]`);
            if (activeSwatch) activeSwatch.classList.add('active');
        } else if (key === 'language') {
            if (window.I18N) {
                I18N.set(value);
                I18N.applySettingsPage();
            }
            if (languageSelect) languageSelect.value = value;
        }

        // 3. Save to Firestore for persistence across devices (if user is not a guest).
        if (currentUser && !currentUser.isAnonymous) {
            try {
                const userDocRef = db.collection('users').doc(currentUser.uid);
                await userDocRef.set({ settings: { [key]: value } }, { merge: true });
            } catch (error) {
                console.error(`Failed to save setting '${key}' to Firestore:`, error);
            }
        }
    };

    // --- Event Listeners ---

    colorSwatchesContainer.addEventListener('click', async (e) => {
        const swatch = e.target.closest('.swatch');
        if (!swatch) return;
        updateSetting('primaryColor', swatch.dataset.color);
    });

    backgroundSwatchesContainer.addEventListener('click', async (e) => {
        const swatch = e.target.closest('.bg-swatch');
        if (!swatch) return;
        customBgStatus.textContent = ''; // Clear custom status
        updateSetting('backgroundImage', swatch.dataset.bg);
    });

    customBgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!currentUser) return; // Must be logged in

        // Basic validation for file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            customBgStatus.textContent = 'حجم الصورة كبير جداً (الحد الأقصى 5MB).';
            customBgStatus.style.color = 'red';
            return;
        }

        const reader = new FileReader();

        customBgStatus.textContent = 'جاري المعالجة...';
        customBgStatus.style.color = '#555';

        reader.onload = (event) => {
            const dataUrl = event.target.result;
            updateSetting('backgroundImage', dataUrl);
            customBgStatus.textContent = 'تم الحفظ بنجاح!';
            customBgStatus.style.color = 'green';
        };

        reader.onerror = () => {
            customBgStatus.textContent = 'حدث خطأ أثناء قراءة الملف.';
            customBgStatus.style.color = 'red';
        };

        reader.readAsDataURL(file);
    });

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            updateSetting('language', lang);
        });
    }

    const restartTourBtn = document.getElementById('restart-tour-btn');
    if (restartTourBtn) {
        restartTourBtn.addEventListener('click', () => {
            if (confirm('هل تريد إعادة تشغيل الجولة التعريفية؟ سيتم نقلك إلى الصفحة الرئيسية.')) {
                localStorage.setItem('restart_tour_flag', 'true');
                localStorage.setItem('tour_v2_completed', 'false'); // Reset completion
                window.location.href = 'tasks.html';
            }
        });
    }
});
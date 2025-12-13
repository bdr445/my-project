document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Setup ---
    // Firebase instances are now globally available from firebase-init.js
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- DOM Elements ---
    const colorSwatchesContainer = document.getElementById('color-swatches');
    const backgroundSwatchesContainer = document.getElementById('background-swatches');
    const customBgInput = document.getElementById('custom-bg-input');
    const customBgStatus = document.getElementById('custom-bg-status');
    const languageSelect = document.getElementById('language-select');
    const pageBlocker = document.getElementById('page-blocker');

    let currentUser = null;

    // This function applies settings from localStorage immediately to prevent FOUC.
    const applySettingsFromCache = () => {
        const language = localStorage.getItem('language') || 'ar';
        if (window.I18N) {
            I18N.set(language);
            I18N.applySettingsPage();
        }

        // Unblock the page view now that styles are applied
        if (pageBlocker) {
            pageBlocker.style.opacity = '0';
            setTimeout(() => pageBlocker.style.display = 'none', 200); // Remove from layout after transition
        }
    };

    // Apply cached settings on script load
    applySettingsFromCache();

    // --- Auth State ---
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            // Re-load settings from Firestore to ensure they are up-to-date
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
        const language = settings.language || localStorage.getItem('language') || 'ar'; // Language is already applied by applySettingsFromCache

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
        if (!key || value === undefined) return Promise.resolve();

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
                return Promise.resolve();
            } catch (error) {
                console.error(`Failed to save setting '${key}' to Firestore:`, error);
                return Promise.reject(error);
            }
        }
        return Promise.resolve();
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
            // Wait for the setting to be saved before reloading the page.
            updateSetting('language', lang).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 100); // A small delay for a smoother feel
            });
        });
    }

    const restartTourBtn = document.getElementById('restart-tour-btn');
    if (restartTourBtn) {
        restartTourBtn.addEventListener('click', () => {
            if (confirm(I18N.t('tour', 'restart_confirm'))) {
                localStorage.setItem('restart_tour_flag', 'true');
                localStorage.setItem('tour_v2_completed', 'false'); // Reset completion
                window.location.href = 'tasks.html';
            }
        });
    }

    // --- Alarm Sound Selection ---
    const alarmSoundSelect = document.getElementById('alarm-sound-select');
    const previewAlarmBtn = document.getElementById('preview-alarm-btn');

    // Load saved alarm sound
    const savedAlarmSound = localStorage.getItem('alarmSound') || 'classic';
    if (alarmSoundSelect) {
        alarmSoundSelect.value = savedAlarmSound;

        alarmSoundSelect.addEventListener('change', (e) => {
            const sound = e.target.value;
            localStorage.setItem('alarmSound', sound);
            updateSetting('alarmSound', sound);
        });
    }

    // Preview alarm sound
    let previewAudioContext = null;
    let previewOscillator = null;
    let previewTimeout = null;

    if (previewAlarmBtn) {
        previewAlarmBtn.addEventListener('click', () => {
            const soundType = alarmSoundSelect.value;
            playPreviewSound(soundType);
        });
    }

    function playPreviewSound(type) {
        // Stop any existing preview
        stopPreviewSound();

        previewAudioContext = new (window.AudioContext || window.webkitAudioContext)();

        switch (type) {
            case 'classic':
                playClassicAlarm(previewAudioContext);
                break;
            case 'gentle':
                playGentleAlarm(previewAudioContext);
                break;
            case 'bell':
                playBellAlarm(previewAudioContext);
                break;
            case 'digital':
                playDigitalAlarm(previewAudioContext);
                break;
            case 'chime':
                playChimeAlarm(previewAudioContext);
                break;
            case 'marimba':
                playMarimbaAlarm(previewAudioContext);
                break;
            case 'radar':
                playRadarAlarm(previewAudioContext);
                break;
            case 'birdsong':
                playBirdsongAlarm(previewAudioContext);
                break;
            case 'ascending':
                playAscendingAlarm(previewAudioContext);
                break;
            case 'pulse':
                playPulseAlarm(previewAudioContext);
                break;
            case 'xylophone':
                playXylophoneAlarm(previewAudioContext);
                break;
            case 'cosmic':
                playCosmicAlarm(previewAudioContext);
                break;
            case 'harp':
                playHarpAlarm(previewAudioContext);
                break;
            case 'piano':
                playPianoAlarm(previewAudioContext);
                break;
            case 'windchimes':
                playWindchimesAlarm(previewAudioContext);
                break;
            case 'bells':
                playBellsAlarm(previewAudioContext);
                break;
            case 'musicbox':
                playMusicboxAlarm(previewAudioContext);
                break;
            case 'flute':
                playFluteAlarm(previewAudioContext);
                break;
        }

        // Auto-stop after 3 seconds
        previewTimeout = setTimeout(() => {
            stopPreviewSound();
        }, 3000);
    }

    function stopPreviewSound() {
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }
        if (previewOscillator) {
            previewOscillator.stop();
            previewOscillator.disconnect();
            previewOscillator = null;
        }
        if (previewAudioContext) {
            previewAudioContext.close();
            previewAudioContext = null;
        }
    }

    function playClassicAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gainNode.gain.value = 0.3;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        lfo.start();
        previewOscillator = osc;
    }

    function playGentleAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1); // A5 note

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        previewOscillator = osc;
    }

    function playBellAlarm(ctx) {
        const playBellNote = (freq, time, duration) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gainNode.gain.setValueAtTime(0.3, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(time);
            osc.stop(time + duration);
        };

        // Ding-dong pattern
        playBellNote(659, ctx.currentTime, 0.5); // E5
        playBellNote(523, ctx.currentTime + 0.5, 0.5); // C5

        // Keep a reference for cleanup
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playDigitalAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'square';

        // Create beep pattern
        const beepPattern = [1000, 1000, 1000]; // Three beeps
        let time = ctx.currentTime;

        beepPattern.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, time + i * 0.3);
            gainNode.gain.setValueAtTime(0.2, time + i * 0.3);
            gainNode.gain.setValueAtTime(0, time + i * 0.3 + 0.15);
        });

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        previewOscillator = osc;
    }

    function playChimeAlarm(ctx) {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.2;
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 1.5);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playMarimbaAlarm(ctx) {
        const melody = [392, 440, 494, 523, 587];
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.25;
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.4);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playRadarAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 600;
        for (let i = 0; i < 5; i++) {
            const time = ctx.currentTime + i * 0.6;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.1);
            gain.gain.linearRampToValueAtTime(0, time + 0.5);
        }
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        previewOscillator = osc;
    }

    function playBirdsongAlarm(ctx) {
        for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const time = ctx.currentTime + i * 0.7;
            osc.frequency.setValueAtTime(1500, time);
            osc.frequency.exponentialRampToValueAtTime(2500, time + 0.1);
            osc.frequency.exponentialRampToValueAtTime(1800, time + 0.2);
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.linearRampToValueAtTime(0, time + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.3);
        }
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playAscendingAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        previewOscillator = osc;
    }

    function playPulseAlarm(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 440;
        for (let i = 0; i < 8; i++) {
            const time = ctx.currentTime + i * 0.35;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.15);
            gain.gain.linearRampToValueAtTime(0, time + 0.3);
        }
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        previewOscillator = osc;
    }

    function playXylophoneAlarm(ctx) {
        const scale = [523, 587, 659, 698, 784, 880, 988, 1047];
        scale.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.15;
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.3);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playCosmicAlarm(ctx) {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 2);
        osc2.frequency.setValueAtTime(330, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        previewOscillator = osc1;
    }

    function playHarpAlarm(ctx) {
        // Harp arpeggio - C major chord
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 1.2);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playPianoAlarm(ctx) {
        // Piano melody - simple pleasant tune
        const melody = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.3;
            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.6);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playWindchimesAlarm(ctx) {
        // Random wind chimes effect
        const baseNotes = [523, 587, 659, 784, 880, 988];
        for (let i = 0; i < 8; i++) {
            const randomNote = baseNotes[Math.floor(Math.random() * baseNotes.length)];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = randomNote;
            const time = ctx.currentTime + i * 0.4 + (Math.random() * 0.2);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 1.5);
        }
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playBellsAlarm(ctx) {
        // Church bells pattern
        const bellNotes = [523.25, 659.25, 783.99]; // C5, E5, G5
        for (let i = 0; i < 3; i++) {
            bellNotes.forEach((freq, j) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const time = ctx.currentTime + (i * 1.5) + (j * 0.3);
                gain.gain.setValueAtTime(0.2, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 1.0);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + 1.0);
            });
        }
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playMusicboxAlarm(ctx) {
        // Music box lullaby melody
        const melody = [659.25, 783.99, 880.00, 783.99, 659.25, 523.25]; // E5, G5, A5, G5, E5, C5
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const time = ctx.currentTime + i * 0.35;
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.5);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }

    function playFluteAlarm(ctx) {
        // Flute-like sound with vibrato
        const melody = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const vibrato = ctx.createOscillator();
            const vibratoGain = ctx.createGain();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;
            vibrato.type = 'sine';
            vibrato.frequency.value = 5; // 5Hz vibrato
            vibratoGain.gain.value = 3;

            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);

            const time = ctx.currentTime + i * 0.4;
            gain.gain.setValueAtTime(0.18, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.7);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(time);
            vibrato.start(time);
            osc.stop(time + 0.7);
            vibrato.stop(time + 0.7);
        });
        previewOscillator = { stop: () => { }, disconnect: () => { } };
    }
});
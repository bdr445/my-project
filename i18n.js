// Lightweight i18n helper shared across pages
(function () {
    const translations = {
        ar: {
            dir: 'rtl',
            home: {
                title: 'مرحباً بك في TaskMaster',
                tagline: 'Your tasks, mastered.',
                desc: 'نظّم مهامك، وحقق أهدافك.\nالوجهة الأمثل لإدارة واجباتك ومشاريعك بكل سهولة.',
                cta: 'ابدأ الآن'
            },
            login: {
                login_title: 'تسجيل الدخول',
                login_sub: 'مرحباً بعودتك! أدخل بياناتك للمتابعة.',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                forgot: 'نسيت كلمة المرور؟',
                login_btn: 'دخول',
                or: 'أو',
                google_login: 'الدخول عبر Google',
                no_account: 'ليس لديك حساب؟',
                goto_signup: 'أنشئ حساباً جديداً',
                signup_title: 'إنشاء حساب جديد',
                signup_sub: 'خطوة بسيطة تفصلك عن تنظيم مهامك.',
                signup_btn: 'إنشاء حساب',
                google_signup: 'المتابعة عبر Google',
                have_account: 'لديك حساب بالفعل؟',
                goto_login: 'سجل الدخول',
                reset_title: 'إعادة تعيين كلمة المرور',
                reset_sub: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين.',
                reset_btn: 'إرسال رابط إعادة التعيين',
                back_to_login: 'العودة لتسجيل الدخول',
                guest: 'أو جرب التطبيق كزائر',
                visitor_name: 'زائر',
                processing: 'جاري المعالجة...'
            },
            tasks: {
                home_link: 'الصفحة الرئيسية',
                categories: 'الفئات',
                all: 'كل المهام',
                urgent: 'عاجلة',
                important: 'مهمة',
                normal: 'عادية',
                deleted: 'سلة المحذوفات',
                settings: 'الإعدادات',
                import: 'استيراد المهام (CSV)',
                export: 'تصدير المهام (CSV)',
                logout: 'تسجيل الخروج',
                greeting_sub: 'نتمنى لك يوماً منتجاً',
                search_placeholder: 'ابحث عن مهمة...',
                sort_label: 'فرز حسب:',
                sort_date: 'تاريخ الاستحقاق',
                sort_priority: 'الأولوية',
                sort_creation: 'تاريخ الإنشاء',
                view_list: 'عرض كقائمة',
                view_grid: 'عرض كشبكة',
                add_task: 'إضافة مهمة جديدة',
                add_task_btn: 'إضافة المهمة',
                title_ph: 'عنوان المهمة (مطلوب)',
                desc_ph: 'أضف وصفاً للمهمة...',
                due_date: 'تاريخ الاستحقاق',
                due_time: 'وقت الاستحقاق (اختياري)',
                priority: 'الأولوية',
                priority_normal: 'عادية',
                priority_important: 'مهمة',
                priority_urgent: 'عاجلة',
                confirm_delete_title: 'تأكيد الحذف',
                confirm_delete_text: 'سيتم نقل هذه المهمة إلى سلة المحذوفات. هل أنت متأكد؟',
                cancel: 'إلغاء',
                delete: 'نعم، احذف',
                import_title: 'استيراد المهام من ملف CSV',
                import_desc: 'اختر ملف CSV يحتوي على مهامك. يجب أن تكون الأعمدة بنفس ترتيب التصدير.',
                import_btn: 'استيراد',
                add_btn_title: 'إضافة مهمة',
                tags_label: 'الوسوم',
                tag_name_ph: 'اسم الوسم',
                tag_hint: '💡 تلميح: لا تنس الضغط على زر (+) لإدراج الوسم.',
                empty_search: 'هممم، لا توجد مهام بهذا الاسم. هل جربت كلمة بحث أخرى؟',
                empty_all: 'لا توجد مهام بعد. هيا أضف مهمتك الأولى من الزر أدناه!',
                empty_section: 'رائع! لا توجد مهام في هذا القسم حالياً.',
                empty_generic: 'يبدو أن هذا القسم فارغ. ربما تجرب فلترًا آخر؟'
                ,
                deleted_retention: 'و سيتم حذف المهام نهائياً بعد 30 يوماً من وجودها في سلة المحذوفات.'
            },
            settings: {
                page_title: 'الإعدادات',
                color_label: 'اللون البارز',
                bg_label: 'صورة الخلفية',
                bg_note: 'ملاحظة: ستحتاج إلى إضافة الصور `bg2.jpg` و `bg3.jpg` إلى مجلد `images` لكي تعمل.',
                custom_bg_label: 'اختر صورة من جهازك',
                custom_bg_note: 'ملاحظة: من المستحسن أن تكون أبعاد الصورة 1920x1080 (دقة عالية) للحصول على أفضل مظهر.',
                language: 'اللغة',
                language_note: 'اختر لغتك المفضلة.',
                back_to_tasks: 'العودة للمهام'
            },
            alarm: {
                alarm_label: 'نغمة المنبه',
                alarm_note: 'اختر نغمة المنبه التي تفضلها عند انتهاء المؤقت.',
                gentle: 'منبه هادئ',
                chime: 'نغمة ناعمة',
                marimba: 'نغمة مرحة',
                birdsong: 'تغريد طيور',
                xylophone: 'نغمة متصاعدة',
                harp: 'نغمة هادئة',
                piano: 'نغمة بسيطة',
                windchimes: 'أجراس هوائية',
                bells: 'أجراس متكررة',
                musicbox: 'نغمة هادئة ومتكررة',
                flute: 'نغمة ناعمة مع اهتزاز',
                cosmic: 'نغمة إثيرية',
                classic: 'منبه كلاسيكي'
            },
            pomodoro: {
                toggle_button_tooltip: 'مؤقت التركيز',
                timer_display_title: 'انتهى الوقت!',
                timer_display_subtitle: 'حان وقت أخذ استراحة',
                dismiss_alarm_button: 'إيقاف المنبه',
                start_button_title: 'تشغيل',
                pause_button_title: 'إيقاف مؤقت',
                reset_button_title: 'إعادة تعيين',
                mute_button_title: 'كتم الصوت',
                unmute_button_title: 'تشغيل الصوت',
                pomodoro_mode: 'تركيز',
                short_break_mode: 'استراحة قصيرة',
                long_break_mode: 'استراحة طويلة',
                custom_mode: 'مخصص',
                set_custom_timer_button: 'تطبيق',
                minutes: 'دقيقة'
            },
            tour: {
                tour_label: 'الجولة التعريفية',
                restart_btn: 'بدء الجولة التعريفية من جديد',
                restart_note: 'هل فاتك شيء؟ يمكنك إعادة تشغيل الجولة المساعدة.',
                restart_confirm: 'هل تريد إعادة تشغيل الجولة التعريفية؟ سيتم نقلك إلى الصفحة الرئيسية.',
                step1_title: 'مرحباً بك في TaskMaster!',
                step1_text: 'لإضافة مهمة جديدة، انقر على هذا الزر.',
                step2_text: 'هنا يمكنك تصفية مهامك حسب الفئة أو الأولوية.',
                step3_text: 'ومن هنا يمكنك الوصول إلى الإعدادات أو تصدير مهامك.',
                finish_button: 'إنهاء الجولة'
            },
            onboarding: {
                step1_title: 'أضف مهامك من هنا!',
                step1_text: 'اضغط على هذا الزر لإنشاء مهمة جديدة.',
                step2_title: 'تتبع مهامك بسهولة',
                step2_text: 'يتم تصنيف مهامك هنا تلقائياً حسب الأولوية والحالة. تنقل بين الفئات لترى ما يهمك.',
                step3_title: 'الإعدادات والمزيد',
                step3_text: 'اضغط على هذا الزر للوصول إلى الإعدادات، تغيير المظهر، أو تسجيل الخروج.',
                next: 'التالي',
                skip: 'تخطي',
                and: 'و',
                got_it: 'فهمت'
            }
        },
        en: {
            dir: 'ltr',
            home: {
                title: 'Welcome to TaskMaster',
                tagline: 'Your tasks, mastered.',
                desc: 'Organize your tasks and achieve your goals.\nThe best place to manage your homework and projects with ease.',
                cta: 'Get Started'
            },
            login: {
                login_title: 'Sign in',
                login_sub: 'Welcome back! Enter your details to continue.',
                email: 'Email',
                password: 'Password',
                forgot: 'Forgot password?',
                login_btn: 'Sign in',
                or: 'or',
                google_login: 'Sign in with Google',
                no_account: "Don't have an account?",
                goto_signup: 'Create a new account',
                signup_title: 'Create Account',
                signup_sub: "You're one step away from organizing your tasks.",
                signup_btn: 'Sign up',
                google_signup: 'Continue with Google',
                have_account: 'Already have an account?',
                goto_login: 'Sign in',
                reset_title: 'Reset Password',
                reset_sub: 'Enter your email and we will send you a reset link.',
                reset_btn: 'Send reset link',
                back_to_login: 'Back to sign in',
                guest: 'Or try the app as a guest',
                visitor_name: 'Guest',
                processing: 'Processing...'
            },
            tasks: {
                home_link: 'Home',
                categories: 'Categories',
                all: 'All tasks',
                urgent: 'Urgent',
                important: 'Important',
                normal: 'Normal',
                deleted: 'Trash',
                settings: 'Settings',
                import: 'Import tasks (CSV)',
                export: 'Export tasks (CSV)',
                logout: 'Logout',
                greeting_sub: 'Have a productive day',
                search_placeholder: 'Search tasks...',
                sort_label: 'Sort by:',
                sort_date: 'Due date',
                sort_priority: 'Priority',
                sort_creation: 'Creation date',
                view_list: 'List view',
                view_grid: 'Grid view',
                add_task: 'Add new task',
                add_task_btn: 'Add task',
                title_ph: 'Task title (required)',
                desc_ph: 'Add a description...',
                due_date: 'Due date',
                due_time: 'Due time (optional)',
                priority: 'Priority',
                priority_normal: 'Normal',
                priority_important: 'Important',
                priority_urgent: 'Urgent',
                confirm_delete_title: 'Confirm delete',
                confirm_delete_text: 'This task will move to trash. Are you sure?',
                cancel: 'Cancel',
                delete: 'Yes, delete',
                import_title: 'Import tasks from CSV',
                import_desc: 'Choose a CSV file with your tasks. Columns must match export order.',
                import_btn: 'Import',
                add_btn_title: 'Add task',
                tags_label: 'Tags',
                tag_name_ph: 'Tag name',
                tag_hint: '💡 Tip: press (+) to add the tag.',
                empty_search: 'Hmm, no tasks match that search. Try another term?',
                empty_all: 'No tasks yet. Add your first task with the button below!',
                empty_section: 'Great! There are no tasks in this section right now.',
                empty_generic: 'This section looks empty. Try a different filter?'
                ,
                deleted_retention: 'Tasks will be permanently deleted 30 days after being moved to Trash.'
            },
            settings: {
                page_title: 'Settings',
                color_label: 'Accent color',
                bg_label: 'Background image',
                bg_note: 'Note: ensure `bg2.jpg` and `bg3.jpg` exist in the images folder.',
                custom_bg_label: 'Choose an image from your device',
                custom_bg_note: 'Tip: use 1920x1080 for best results.',
                language: 'Language',
                language_note: 'Choose your preferred language.',
                back_to_tasks: 'Back to tasks'
            },
            alarm: {
                alarm_label: 'Alarm sound',
                alarm_note: 'Choose your preferred alarm sound when the timer ends.',
                gentle: 'Gentle',
                chime: 'Chime',
                marimba: 'Marimba',
                birdsong: 'Birdsong',
                xylophone: 'Xylophone',
                harp: 'Harp',
                piano: 'Piano',
                windchimes: 'Wind Chimes',
                bells: 'Bells',
                musicbox: 'Music Box',
                flute: 'Flute',
                cosmic: 'Cosmic',
                classic: 'Classic'
            },
            pomodoro: {
                toggle_button_tooltip: 'Focus Timer',
                timer_display_title: 'Time\'s Up!',
                timer_display_subtitle: 'Time to take a break',
                dismiss_alarm_button: 'Dismiss Alarm',
                start_button_title: 'Start',
                pause_button_title: 'Pause',
                reset_button_title: 'Reset',
                mute_button_title: 'Mute',
                unmute_button_title: 'Unmute',
                pomodoro_mode: 'Pomodoro',
                short_break_mode: 'Break',
                long_break_mode: 'Custom',
                custom_mode: 'Custom',
                set_custom_timer_button: 'Set',
                minutes: 'minute'
            },
            tour: {
                tour_label: 'Tour',
                restart_btn: 'Restart Tour',
                restart_note: 'Missed something? You can restart the guided tour.',
                restart_confirm: 'Do you want to restart the tour? You will be redirected to the main page.',
                step1_title: 'Welcome to TaskMaster!',
                step1_text: 'To add a new task, click this button.',
                step2_text: 'Here you can filter your tasks by category or priority.',
                step3_text: 'And from here you can access settings or export your tasks.',
                finish_button: 'Finish Tour'
            },
            onboarding: {
                step1_title: 'Add your tasks from here!',
                step1_text: 'Press this button to create a new task.',
                step2_title: 'Track your tasks easily',
                step2_text: 'Your tasks are automatically categorized here by priority and status. Navigate between categories to see what matters to you.',
                step3_title: 'Settings and more',
                step3_text: 'Press this button to access settings, change the theme, or log out.',
                next: 'Next',
                skip: 'Skip',
                and: 'and',
                got_it: 'Got it'
            }
        }
    };

    const I18N = {
        // Convert digits to Arabic-Indic digits when language is Arabic
        localizeNumber(n, lang) {
            const s = String(n);
            if ((lang || I18N.get()) === 'ar') {
                const map = { '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩' };
                return s.replace(/[0-9]/g, d => map[d]);
            }
            return s;
        },
        t(page, key, lang) {
            const l = lang || I18N.get();
            return translations[l]?.[page]?.[key] || translations.ar[page][key] || key;
        },
        get() {
            return localStorage.getItem('language') || 'ar';
        },
        set(lang) {
            if (!translations[lang]) return;
            localStorage.setItem('language', lang);
            I18N.applyDir(lang);
            // إطلاق حدث مخصص لإعلام الصفحات بأن اللغة قد تغيرت
            document.dispatchEvent(new CustomEvent('language-changed'));
        },
        applyDir(lang) {
            const dir = translations[lang]?.dir || 'rtl';
            document.documentElement.lang = lang;
            document.documentElement.dir = dir;
            document.body.classList.remove('lang-rtl', 'lang-ltr');
            document.body.classList.add(dir === 'rtl' ? 'lang-rtl' : 'lang-ltr');
        },
        applyHome() {
            const lang = I18N.get();
            I18N.applyDir(lang);
            const map = translations[lang].home;
            document.title = map.title;
            const setText = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
            const h1 = document.querySelector('h1');
            if (h1) {
                if (lang === 'en') {
                    // Split "Welcome to TaskMaster" into two lines: "Welcome to" on first line, "TaskMaster" on second
                    h1.innerHTML = `Welcome to<br>TaskMaster`;
                } else {
                    // Arabic: split "مرحباً بك في TaskMaster" into "مرحباً بك في" and "TaskMaster"
                    h1.innerHTML = `مرحباً بك في<br>TaskMaster`;
                }
            }
            setText('.title', map.title);
            setText('.tagline', map.tagline);
            const descEl = document.querySelector('.description');
            if (descEl) descEl.textContent = map.desc;
            const btn = document.querySelector('.btn');
            if (btn) btn.textContent = map.cta;
        },

        applyLogin() {
            const lang = I18N.get();
            I18N.applyDir(lang);
            const t = (k) => I18N.t('login', k, lang);
            const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };

            set('#login-form h1', t('login_title'));
            set('#login-form p', t('login_sub'));
            set('label[for="login-email"]', t('email'));
            set('label[for="login-password"]', t('password'));
            const forgot = document.getElementById('forgot-password-link'); if (forgot) forgot.textContent = t('forgot');
            const loginBtn = document.querySelector('#login-form .btn'); if (loginBtn) loginBtn.textContent = t('login_btn');
            const sep = document.querySelector('#login-form .separator span'); if (sep) sep.textContent = t('or');
            const googleLogin = document.getElementById('google-signin-btn-login'); if (googleLogin) googleLogin.textContent = t('google_login');

            // Signup form
            set('#signup-form h1', t('signup_title'));
            set('#signup-form p', t('signup_sub'));
            set('label[for="signup-email"]', t('email'));
            set('label[for="signup-password"]', t('password'));
            const signupBtn = document.querySelector('#signup-form .btn'); if (signupBtn) signupBtn.textContent = t('signup_btn');
            const showLogin = document.getElementById('show-login'); if (showLogin) showLogin.textContent = t('goto_login');

            // Reset form
            set('#reset-password-form h1', t('reset_title'));
            set('#reset-password-form p', t('reset_sub'));
            const resetBtn = document.querySelector('#reset-password-form .btn'); if (resetBtn) resetBtn.textContent = t('reset_btn');
            const backToLogin = document.getElementById('back-to-login'); if (backToLogin) backToLogin.textContent = t('back_to_login');

            // Guest and links
            const guest = document.getElementById('guest-login-btn'); if (guest) guest.textContent = t('guest');

            // Update the small switch links that contain surrounding text + link
            const loginSwitch = document.querySelector('#login-form .form-switch');
            if (loginSwitch) {
                loginSwitch.innerHTML = `${I18N.t('login', 'no_account', lang)} <a href="#" id="show-signup">${t('goto_signup')}</a>`;
            }
            const signupSwitch = document.querySelector('#signup-form .form-switch');
            if (signupSwitch) {
                signupSwitch.innerHTML = `${t('have_account')} <a href="#" id="show-login">${t('goto_login')}</a>`;
            }

            // Placeholders
            const loginEmail = document.getElementById('login-email'); if (loginEmail) loginEmail.placeholder = t('email');
            const loginPassword = document.getElementById('login-password'); if (loginPassword) loginPassword.placeholder = t('password');
            const signupEmail = document.getElementById('signup-email'); if (signupEmail) signupEmail.placeholder = t('email');
            const signupPassword = document.getElementById('signup-password'); if (signupPassword) signupPassword.placeholder = t('password');
            const resetEmail = document.getElementById('reset-email'); if (resetEmail) resetEmail.placeholder = t('email');
        },

        applyTasks() {
            const lang = I18N.get();
            I18N.applyDir(lang);
            // Ensure body has tasks-page class for proper styling
            document.body.classList.add('tasks-page');
            const t = (k) => I18N.t('tasks', k, lang);
            const q = (sel) => document.querySelector(sel);
            const _homeLink = q('.home-link'); if (_homeLink) _homeLink.textContent = t('home_link');
            const _navH2 = q('nav h2'); if (_navH2) _navH2.textContent = t('categories');
            const setFilter = (selector, label) => { const el = q(selector + ' .link-text'); if (el) el.childNodes[0].nodeValue = label + ' '; };
            setFilter('[data-filter="all"]', t('all'));
            setFilter('[data-filter="urgent"]', t('urgent'));
            setFilter('[data-filter="important"]', t('important'));
            setFilter('[data-filter="normal"]', t('normal'));
            const trash = q('[data-filter="deleted"] .link-text'); if (trash) trash.textContent = t('deleted');
            const _settingsBtn = q('#settings-btn'); if (_settingsBtn) _settingsBtn.textContent = t('settings');
            const _importBtn = q('#import-btn'); if (_importBtn) _importBtn.textContent = t('import');
            const _exportBtn = q('#export-btn'); if (_exportBtn) _exportBtn.textContent = t('export');
            const _logoutBtn = q('#logout-btn'); if (_logoutBtn) _logoutBtn.textContent = t('logout');
            const greetMain = q('.user-greeting-text');
            if (greetMain) {
                let name = '...';
                try {
                    const currentUser = (window.firebase && firebase.auth) ? firebase.auth().currentUser : null;
                    if (currentUser) {
                        if (currentUser.isAnonymous) {
                            name = I18N.t('login', 'visitor_name', lang) || '...';
                        } else {
                            name = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : '...');
                        }
                    } else {
                        name = (document.getElementById('user-name')?.textContent || '...');
                    }
                } catch (e) {
                    name = (document.getElementById('user-name')?.textContent || '...');
                }

                const prefix = lang === 'ar' ? 'مرحباً، ' : 'Hi, ';
                const userNameSpan = document.getElementById('user-name');
                if (userNameSpan) {
                    userNameSpan.textContent = name;
                    if (userNameSpan.previousSibling && userNameSpan.previousSibling.nodeType === Node.TEXT_NODE) {
                        userNameSpan.previousSibling.nodeValue = prefix;
                    } else {
                        greetMain.insertBefore(document.createTextNode(prefix), userNameSpan);
                    }
                } else {
                    greetMain.textContent = `${prefix}${name}`;
                }
            }
            const greetingSub = q('.user-greeting-sub'); if (greetingSub) greetingSub.textContent = t('greeting_sub');
            const search = q('#search-input'); if (search) search.placeholder = t('search_placeholder');
            const sortLabel = q('.sort-options span'); if (sortLabel) sortLabel.textContent = t('sort_label');
            const sortBtns = q('.sort-options'); if (sortBtns) {
                const btns = sortBtns.querySelectorAll('button');
                if (btns[0]) btns[0].textContent = t('sort_date');
                if (btns[1]) btns[1].textContent = t('sort_priority');
                if (btns[2]) btns[2].textContent = t('sort_creation');
            }
            const viewBtns = q('.view-options'); if (viewBtns) {
                const btns = viewBtns.querySelectorAll('button');
                if (btns[0]) btns[0].title = t('view_list');
                if (btns[1]) btns[1].title = t('view_grid');
            }
            // Pomodoro widget texts
            try {
                const p = (k) => I18N.t('pomodoro', k, lang);
                const modeBtns = document.querySelectorAll('#pomodoro-widget .mode-btn');
                if (modeBtns && modeBtns.length >= 3) {
                    modeBtns[0].textContent = p('pomodoro_mode');
                    modeBtns[1].textContent = p('short_break_mode');
                    modeBtns[2].textContent = p('long_break_mode');
                }
                const customBtn = document.getElementById('set-custom-timer');
                if (customBtn) customBtn.textContent = p('set_custom_timer_button');
                const minutesLabel = document.querySelector('#custom-timer-input span');
                if (minutesLabel) minutesLabel.textContent = p('minutes');
                const customMinutes = document.getElementById('custom-minutes');
                if (customMinutes) {
                    // ensure placeholder reflects localized digits when appropriate
                    customMinutes.placeholder = I18N.localizeNumber(customMinutes.value || customMinutes.placeholder || '25', lang);
                }
                // localize timer displays
                const timerDisplay = document.getElementById('pomodoro-timer');
                if (timerDisplay) timerDisplay.textContent = I18N.localizeNumber(timerDisplay.textContent || '25:00', lang);
                const miniDisplay = document.getElementById('mini-timer-display');
                if (miniDisplay) miniDisplay.textContent = I18N.localizeNumber(miniDisplay.textContent || '25:00', lang);
            } catch (e) { }
            q('#add-task-btn')?.setAttribute('title', t('add_btn_title'));
            const modalTitle = q('#modal-title'); if (modalTitle) modalTitle.textContent = t('add_task');
            const submitBtn = q('#modal-submit-btn'); if (submitBtn) submitBtn.textContent = t('add_task_btn');
            const titleInput = q('#task-title'); if (titleInput) titleInput.placeholder = t('title_ph');
            const descInput = q('#task-desc'); if (descInput) descInput.placeholder = t('desc_ph');
            const _dueDateLabel = q('label[for="task-due-date"]'); if (_dueDateLabel) _dueDateLabel.textContent = t('due_date');
            const _dueTimeLabel = q('label[for="task-due-time"]'); if (_dueTimeLabel) _dueTimeLabel.textContent = t('due_time');
            const _priorityLabel = q('label[for="task-priority"]'); if (_priorityLabel) _priorityLabel.textContent = t('priority');
            const prioritySelect = q('#task-priority');
            if (prioritySelect) {
                const opts = prioritySelect.querySelectorAll('option');
                if (opts[0]) opts[0].textContent = t('priority_normal');
                if (opts[1]) opts[1].textContent = t('priority_important');
                if (opts[2]) opts[2].textContent = t('priority_urgent');
            }
            const delTitle = q('#confirm-delete-modal h2'); if (delTitle) delTitle.textContent = t('confirm_delete_title');
            const delText = q('#confirm-delete-modal p'); if (delText) delText.textContent = t('confirm_delete_text');
            const _cancelDelete = q('#cancel-delete-btn'); if (_cancelDelete) _cancelDelete.textContent = t('cancel');
            const _confirmDelete = q('#confirm-delete-btn'); if (_confirmDelete) _confirmDelete.textContent = t('delete');
            const _importModalH2 = q('#import-modal h2'); if (_importModalH2) _importModalH2.textContent = t('import_title');
            const _importModalP = q('#import-modal p'); if (_importModalP) _importModalP.textContent = t('import_desc');
            // Tags header in sidebar (second h2 inside nav)
            try {
                const navH2s = document.querySelectorAll('nav h2');
                if (navH2s && navH2s.length > 1) navH2s[1].textContent = t('tags_label');
            } catch (e) { }
            // Tag input label inside modal (label immediately before .tag-input-group)
            const tagInputGroup = document.querySelector('.tag-input-group');
            if (tagInputGroup && tagInputGroup.previousElementSibling) tagInputGroup.previousElementSibling.textContent = t('tags_label');
            const newTagInput = q('#new-tag-name'); if (newTagInput) newTagInput.placeholder = t('tag_name_ph');
            const tagHint = q('#tag-hint-message'); if (tagHint) tagHint.textContent = t('tag_hint');

            // Update FAB tooltip via data attribute (CSS uses attr())
            const fab = q('.fab'); if (fab) fab.setAttribute('data-tooltip', t('add_btn_title'));

            // Pomodoro toggle tooltip and title
            const pomodoroToggle = q('#pomodoro-toggle-btn'); if (pomodoroToggle) {
                pomodoroToggle.title = t('pomodoro', 'toggle_button_tooltip') || t('pomodoro', 'toggle_button_tooltip');
                pomodoroToggle.setAttribute('data-tooltip', t('pomodoro', 'toggle_button_tooltip'));
            }
            const importBtn = q('#import-form .btn'); if (importBtn) importBtn.textContent = t('import_btn');
        },
        applySettingsPage() {
            const lang = I18N.get();
            I18N.applyDir(lang);
            const t = (k) => I18N.t('settings', k, lang);
            const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text; };
            set('.settings-container h1', t('page_title'));
            const groups = document.querySelectorAll('.setting-group');
            if (groups[0]) groups[0].querySelector('h2').textContent = t('color_label');
            if (groups[1]) {
                groups[1].querySelector('h2').textContent = t('bg_label');
                const bgNote = groups[1].querySelector('p');
                if (bgNote) bgNote.textContent = t('bg_note');
            }
            if (groups[2]) {
                groups[2].querySelector('h2').textContent = t('custom_bg_label');
                const customNote = groups[2].querySelector('p');
                if (customNote) customNote.textContent = t('custom_bg_note');
            }
            // custom bg file input label
            const customLabel = document.querySelector('label[for="custom-bg-input"]');
            if (customLabel) customLabel.textContent = t('custom_bg_label');
            if (groups[3]) {
                groups[3].querySelector('h2').textContent = t('language');
                const langNote = groups[3].querySelector('p');
                if (langNote) langNote.textContent = t('language_note');
            }
            const backBtn = document.querySelector('.btn[href="tasks.html"]'); if (backBtn) backBtn.textContent = t('back_to_tasks');
            const langSelect = document.getElementById('language-select'); if (langSelect) langSelect.value = lang;

            // Tour section (usually groups[4])
            try {
                const tourGroup = groups[4];
                if (tourGroup) {
                    tourGroup.querySelector('h2').textContent = I18N.t('tour', 'tour_label', lang) || tourGroup.querySelector('h2').textContent;
                    const restartBtn = tourGroup.querySelector('#restart-tour-btn');
                    if (restartBtn) restartBtn.textContent = I18N.t('tour', 'restart_btn', lang);
                    const restartNote = tourGroup.querySelector('p');
                    if (restartNote) restartNote.textContent = I18N.t('tour', 'restart_note', lang);
                }
            } catch (e) { }

            // Alarm section (usually last)
            try {
                const alarmGroup = groups[5];
                if (alarmGroup) {
                    alarmGroup.querySelector('h2').textContent = I18N.t('alarm', 'alarm_label', lang) || alarmGroup.querySelector('h2').textContent;
                    const alarmNote = alarmGroup.querySelector('p');
                    if (alarmNote) alarmNote.textContent = I18N.t('alarm', 'alarm_note', lang);
                    const alarmSelect = document.getElementById('alarm-sound-select');
                    if (alarmSelect) {
                        Array.from(alarmSelect.options).forEach(opt => {
                            const key = opt.value;
                            const label = I18N.t('alarm', key, lang);
                            if (label) opt.textContent = label;
                        });
                    }
                }
            } catch (e) { }
        }
    };
    // Apply translations for current page when language changes
    document.addEventListener('language-changed', () => {
        try {
            // First, apply direction immediately
            const lang = I18N.get();
            I18N.applyDir(lang);

            const body = document.body || {};
            if (body.classList && body.classList.contains('home-page')) {
                I18N.applyHome();
            } else if (body.classList && body.classList.contains('settings-page')) {
                I18N.applySettingsPage();
            } else if (body.classList && body.classList.contains('login-page')) {
                I18N.applyLogin();
            } else {
                // Fallback: try applying tasks/home where applicable
                if (typeof I18N.applyTasks === 'function') I18N.applyTasks();
                if (typeof I18N.applyHome === 'function') I18N.applyHome();
            }

            // Additionally, force-position floating controls in case CSS rules didn't apply
            const dir = translations[lang]?.dir || document.documentElement.dir || 'rtl';
            // Pomodoro toggle button
            const pomodoroBtn = document.getElementById('pomodoro-toggle-btn');
            if (pomodoroBtn) {
                if (dir === 'ltr') {
                    // place pomodoro above the FAB on the right side (move slightly left)
                    // FAB: right ~30px; increase to 40px to shift pomodoro 10px left
                    pomodoroBtn.style.right = '32px';
                    pomodoroBtn.style.left = 'auto';
                    pomodoroBtn.style.bottom = '90px';
                } else {
                    // RTL: mirror placement above the FAB on the left (move slightly left)
                    // increase left to shift toward center
                    pomodoroBtn.style.left = '32px';
                    pomodoroBtn.style.right = 'auto';
                    pomodoroBtn.style.bottom = '90px';
                }
                pomodoroBtn.style.zIndex = '1001';
            }
            // FAB (Add task) - let CSS handle positioning via .lang-ltr and .lang-rtl classes
            // Remove any inline styles that might interfere with CSS rules
            const fab = document.querySelector('.fab');
            if (fab) {
                fab.style.right = '';
                fab.style.left = '';
            }
            // Pomodoro timer widget
            const timerWidget = document.getElementById('pomodoro-widget');
            if (timerWidget) {
                if (dir === 'ltr') {
                    // English (LTR): position on the right
                    timerWidget.style.right = '0';
                    timerWidget.style.left = 'auto';
                } else {
                    // Arabic (RTL): position on the left
                    timerWidget.style.left = '0';
                    timerWidget.style.right = 'auto';
                }
            }
        } catch (e) {
            // swallow errors to avoid breaking pages
            console.debug('I18N language-changed handler error', e);
        }
    });

    // Initialize pomodoro widget to be expanded on button click
    const setupPomodoroClickExpand = () => {
        const pomodoroToggle = document.getElementById('pomodoro-toggle-btn');
        if (pomodoroToggle) {
            pomodoroToggle.addEventListener('click', () => {
                const timerWidget = document.getElementById('pomodoro-widget');
                if (timerWidget && !timerWidget.classList.contains('hidden')) {
                    // When widget becomes visible (not hidden), also remove minimized state
                    timerWidget.classList.remove('minimized');
                }
            });
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPomodoroClickExpand);
    } else {
        setupPomodoroClickExpand();
    }

    // Auto-apply translations on initial load
    const init = () => {
        const bodyClassList = document.body.classList;
        if (bodyClassList.contains('home-page')) {
            I18N.applyHome();
        } else if (bodyClassList.contains('login-page')) {
            I18N.applyLogin();
        } else if (bodyClassList.contains('tasks-page')) {
            I18N.applyTasks();
        } else if (bodyClassList.contains('settings-page')) {
            I18N.applySettingsPage();
        }
    };
    document.addEventListener('DOMContentLoaded', init);
    window.I18N = I18N;
})();

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
                guest: 'أو جرب التطبيق كزائر'
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
                add_btn_title: 'إضافة مهمة'
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
                guest: 'Or try the app as a guest'
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
                add_btn_title: 'Add task'
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
            }
        }
    };

    const I18N = {
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
            const setText = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
            setText('h1', map.title);
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
            const set = (sel, key) => { const el = document.querySelector(sel); if (el) el.textContent = key; };
            set('form#login-form h1', t('login_title'));
            set('form#login-form p', t('login_sub'));
            set('label[for="login-email"]', t('email'));
            set('label[for="login-password"]', t('password'));
            const forgot = document.getElementById('forgot-password-link'); if (forgot) forgot.textContent = t('forgot');
            const loginBtn = document.querySelector('#login-form .btn'); if (loginBtn) loginBtn.textContent = t('login_btn');
            const separators = document.querySelectorAll('.separator span'); separators.forEach(s => s.textContent = t('or'));
            const gLogin = document.getElementById('google-signin-btn-login'); if (gLogin) gLogin.textContent = t('google_login');
            const loginSwitch = document.querySelector('#login-form .form-switch'); if (loginSwitch) loginSwitch.innerHTML = `${t('no_account')} <a href="#" id="show-signup">${t('goto_signup')}</a>`;

            set('form#signup-form h1', t('signup_title'));
            const signupP = document.querySelector('form#signup-form p'); if (signupP) signupP.textContent = t('signup_sub');
            set('label[for="signup-email"]', t('email'));
            set('label[for="signup-password"]', t('password'));
            const signupBtn = document.querySelector('#signup-form .btn'); if (signupBtn) signupBtn.textContent = t('signup_btn');
            const gSignup = document.getElementById('google-signin-btn-signup'); if (gSignup) gSignup.textContent = t('google_signup');
            const signupSwitch = document.querySelector('#signup-form .form-switch'); if (signupSwitch) signupSwitch.innerHTML = `${t('have_account')} <a href="#" id="show-login">${t('goto_login')}</a>`;

            set('form#reset-password-form h1', t('reset_title'));
            const resetP = document.querySelector('form#reset-password-form p'); if (resetP) resetP.textContent = t('reset_sub');
            set('label[for="reset-email"]', t('email'));
            const resetBtn = document.querySelector('#reset-password-form .btn'); if (resetBtn) resetBtn.textContent = t('reset_btn');
            const backLink = document.getElementById('back-to-login'); if (backLink) backLink.textContent = t('back_to_login');

            const guest = document.getElementById('guest-login-btn'); if (guest) guest.textContent = t('guest');
        },
        applyTasks() {
            const lang = I18N.get();
            I18N.applyDir(lang);
            const t = (k) => I18N.t('tasks', k, lang);
            const q = (sel) => document.querySelector(sel);
            q('.home-link')?.textContent = t('home_link');
            q('nav h2')?.textContent = t('categories');
            const setFilter = (selector, label) => { const el = q(selector + ' .link-text'); if (el) el.childNodes[0].nodeValue = label + ' '; };
            setFilter('[data-filter="all"]', t('all'));
            setFilter('[data-filter="urgent"]', t('urgent'));
            setFilter('[data-filter="important"]', t('important'));
            setFilter('[data-filter="normal"]', t('normal'));
            const trash = q('[data-filter="deleted"] .link-text'); if (trash) trash.textContent = t('deleted');
            q('#settings-btn')?.textContent = t('settings');
            q('#import-btn')?.textContent = t('import');
            q('#export-btn')?.textContent = t('export');
            q('#logout-btn')?.textContent = t('logout');
            const greetMain = q('.user-greeting-text');
            if (greetMain) {
                const name = (document.getElementById('user-name')?.textContent || '...');
                const prefix = lang === 'ar' ? 'مرحباً، ' : 'Hi, ';
                greetMain.textContent = `${prefix}${name}`;
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
            q('#add-task-btn')?.setAttribute('title', t('add_btn_title'));
            const modalTitle = q('#modal-title'); if (modalTitle) modalTitle.textContent = t('add_task');
            const submitBtn = q('#modal-submit-btn'); if (submitBtn) submitBtn.textContent = t('add_task_btn');
            const titleInput = q('#task-title'); if (titleInput) titleInput.placeholder = t('title_ph');
            const descInput = q('#task-desc'); if (descInput) descInput.placeholder = t('desc_ph');
            q('label[for="task-due-date"]')?.textContent = t('due_date');
            q('label[for="task-due-time"]')?.textContent = t('due_time');
            q('label[for="task-priority"]')?.textContent = t('priority');
            const prioritySelect = q('#task-priority');
            if (prioritySelect) {
                const opts = prioritySelect.querySelectorAll('option');
                if (opts[0]) opts[0].textContent = t('priority_normal');
                if (opts[1]) opts[1].textContent = t('priority_important');
                if (opts[2]) opts[2].textContent = t('priority_urgent');
            }
            const delTitle = q('#confirm-delete-modal h2'); if (delTitle) delTitle.textContent = t('confirm_delete_title');
            const delText = q('#confirm-delete-modal p'); if (delText) delText.textContent = t('confirm_delete_text');
            q('#cancel-delete-btn')?.textContent = t('cancel');
            q('#confirm-delete-btn')?.textContent = t('delete');
            q('#import-modal h2')?.textContent = t('import_title');
            q('#import-modal p')?.textContent = t('import_desc');
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
            if (groups[3]) {
                groups[3].querySelector('h2').textContent = t('language');
                const langNote = groups[3].querySelector('p');
                if (langNote) langNote.textContent = t('language_note');
            }
            const backBtn = document.querySelector('.btn[href="tasks.html"]'); if (backBtn) backBtn.textContent = t('back_to_tasks');
            const langSelect = document.getElementById('language-select'); if (langSelect) langSelect.value = lang;
        }
    };

    window.I18N = I18N;
})();


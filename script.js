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
    const db = firebase.firestore();
    let tasksCollection; // Will be defined after user logs in

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const tasksList = document.getElementById('tasks-list');
    const modalTitle = document.getElementById('modal-title');
    const modalSubmitBtn = document.getElementById('modal-submit-btn');
    const modal = document.getElementById('add-task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const alertsContainer = document.getElementById('alerts-container');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const categoryFilters = document.getElementById('category-filters');
    const sortButtons = document.querySelector('.sort-options');
    const searchInput = document.getElementById('search-input');
    const viewOptions = document.querySelector('.view-options');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const accountMenuBtn = document.getElementById('account-menu-btn');
    const accountMenu = document.getElementById('account-menu');
    const exportBtn = document.getElementById('export-btn');
    const sidebar = document.getElementById('sidebar');
    const importBtn = document.getElementById('import-btn');
    const importModal = document.getElementById('import-modal');
    const importForm = document.getElementById('import-form');
    const csvFileInput = document.getElementById('csv-file-input');
    const pageBlocker = document.getElementById('page-blocker');
    const importStatus = document.getElementById('import-status');
    const userNameEl = document.getElementById('user-name');
    const userAvatarEl = document.getElementById('user-avatar');
    const greetingTextEl = document.querySelector('.user-greeting-text');

    // App State
    let currentFilter = 'all';
    let currentSort = 'date';
    let currentView = localStorage.getItem('taskView') || 'list'; // Load preference
    let currentSearchTerm = '';
    let editingTaskId = null;
    let taskToDeleteId = null;
    let localTasksCache = []; // A local cache to make UI faster
    let periodicCheckInterval = null; // To hold the interval ID

    // --- Auth State Logic ---
    // --- Settings Logic ---
    // This function applies settings from localStorage immediately to prevent FOUC.
    const applySettingsFromCache = () => {
        const primaryColor = localStorage.getItem('primaryColor');
        const backgroundImage = localStorage.getItem('backgroundImage');
        const language = localStorage.getItem('language') || 'ar';
        if (window.I18N) {
            I18N.set(language);
            I18N.applyTasks();
        }
        if (primaryColor) {
            document.documentElement.style.setProperty('--primary-color', primaryColor);
        }
        if (backgroundImage) {
            document.documentElement.style.setProperty('--background-image', `url('${backgroundImage}')`);
        }

        // Unblock the page view now that styles are applied
        if (pageBlocker) {
            pageBlocker.style.opacity = '0';
            setTimeout(() => pageBlocker.style.display = 'none', 200); // Remove from layout after transition
        }
    };

    // This function fetches the definitive settings from Firestore after login.
    const syncSettingsFromFirestore = async (user) => {
        if (!user || user.isAnonymous) return; // Only for logged-in users
        try {
            const settingsDoc = await db.collection('users').doc(user.uid).get();
            if (settingsDoc.exists) {
                const settings = settingsDoc.data().settings || {};
                // Update localStorage and apply settings from the source of truth (Firestore)
                if (settings.primaryColor) localStorage.setItem('primaryColor', settings.primaryColor);
                if (settings.backgroundImage) localStorage.setItem('backgroundImage', settings.backgroundImage);
                if (settings.language) localStorage.setItem('language', settings.language);
                applySettingsFromCache(); // Re-apply with fresh data
            }
        } catch (error) {
            console.error("Error fetching settings from Firestore:", error);
        }
    };

    const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230078d4'/><stop offset='100%' stop-color='%23205a9d'/></linearGradient></defs><rect width='120' height='120' rx='60' fill='url(%23g)'/><circle cx='60' cy='52' r='22' fill='white' fill-opacity='0.85'/><path d='M30 100c4-20 24-24 30-24s26 4 30 24' fill='white' fill-opacity='0.85' stroke='none'/></svg>";

    const setAvatar = (el, user, displayNameFallback) => {
        if (!el) return;
        const name = user.isAnonymous ? 'زائر' : (user.displayName || displayNameFallback || 'مستخدم');
        if (user.photoURL) {
            el.style.backgroundImage = `url('${user.photoURL}')`;
            el.textContent = '';
        } else {
            el.style.backgroundImage = `url("${DEFAULT_AVATAR}")`;
            el.textContent = '';
        }
    };

    const applyUserProfile = (user) => {
        const displayName = user.isAnonymous ? "زائر" : (user.displayName || user.email.split('@')[0]);
        if (accountMenuBtn) {
            accountMenuBtn.querySelector('.link-text').textContent = displayName;
        }
        if (userNameEl) {
            userNameEl.textContent = displayName;
        }
        setAvatar(userAvatarEl, user, displayName);
        if (greetingTextEl) {
            const lang = window.I18N ? I18N.get() : 'ar';
            const prefix = lang === 'ar' ? 'مرحباً، ' : 'Hi, ';
            greetingTextEl.textContent = `${prefix}${displayName}`;
        }
    };

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            applyUserProfile(user);

            // Define the collection path for this user's tasks
            tasksCollection = db.collection('users').doc(user.uid).collection('tasks');
            // Start the app by fetching tasks
            autoDeleteOldTasks(); // Run the auto-delete check on startup
            renderTasks();
            applyViewPreference(); // Apply saved view
            syncSettingsFromFirestore(user); // Sync settings from Firestore
            initializeSidebar(); // Setup sidebar state
            // Start the periodic check for due dates
            if (periodicCheckInterval) clearInterval(periodicCheckInterval); // Clear any existing interval
            periodicCheckInterval = setInterval(periodicCheck, 60000); // Check every 60 seconds
        } else {
            // User is signed out.
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear all user-specific settings from localStorage upon logout
        localStorage.removeItem('primaryColor');
        localStorage.removeItem('backgroundImage');
        localStorage.removeItem('taskView');
        localStorage.removeItem('sidebarCollapsed');
        // Stop the periodic check on logout
        if (periodicCheckInterval) clearInterval(periodicCheckInterval);

        auth.signOut();
    });

    // --- Account Menu Logic ---
    accountMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        accountMenu.classList.toggle('hidden');
    });
    // Hide menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!accountMenuBtn.contains(e.target) && !accountMenu.contains(e.target)) {
            accountMenu.classList.add('hidden');
        }
    });
    // --- Empty Trash Logic ---
    const emptyTrash = async () => {
        if (!confirm('هل أنت متأكد من حذف جميع المهام في سلة المحذوفات؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        if (!tasksCollection) return;
        const snapshot = await tasksCollection.where('isDeleted', '==', true).get();

        if (snapshot.empty) {
            alert('سلة المحذوفات فارغة بالفعل.');
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        try {
            await batch.commit();
            renderTasks();
            alert('تم إفراغ سلة المحذوفات بنجاح.');
        } catch (error) {
            console.error("Error emptying trash: ", error);
            alert("حدث خطأ أثناء إفراغ سلة المحذوفات.");
        }
    };

    // --- Modal Logic ---
    let currentSubtasks = []; // Temporary storage for subtasks in the modal
    let currentTags = []; // Temporary storage for tags in the modal (Array of objects {name, color})

    // --- Tags Logic Helper ---
    const getGlobalTags = () => {
        const uniqueTags = new Map();
        localTasksCache.forEach(task => { // Use localTasksCache which has all tasks
            if (task.tags && !task.isDeleted) {
                task.tags.forEach(t => {
                    const name = typeof t === 'string' ? t : t.name;
                    const color = typeof t === 'string' ? '#e0e0e0' : t.color;
                    // Only store distinct case-insensitive tags
                    if (!uniqueTags.has(name.toLowerCase())) {
                        uniqueTags.set(name.toLowerCase(), { name, color });
                    }
                });
            }
        });
        return uniqueTags;
    };

    const updateTagSuggestions = () => {
        const dataList = document.getElementById('available-tags');
        if (!dataList) return;

        dataList.innerHTML = '';
        const globalTags = getGlobalTags();

        globalTags.forEach(tagRef => {
            const option = document.createElement('option');
            option.value = tagRef.name;
            dataList.appendChild(option);
        });
    };

    // --- Tag Hint Logic ---
    const tagHintElement = document.getElementById('tag-hint-message');

    // Auto-fill color on selection & Show Hint
    const newTagNameInput = document.getElementById('new-tag-name');
    const newTagColorInput = document.getElementById('new-tag-color');

    if (newTagNameInput) {
        newTagNameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            const valLower = val.toLowerCase();
            const globalTags = getGlobalTags();

            // Auto Color Logic
            if (globalTags.has(valLower)) {
                const tagRef = globalTags.get(valLower);
                if (newTagColorInput) newTagColorInput.value = tagRef.color;
            }

            // Hint Logic: Show if typing and not dismiss permanently
            // Check if dismissed before showing
            if (val.length > 0) {
                if (localStorage.getItem('tagHintDismissed') !== 'true') {
                    if (tagHintElement) tagHintElement.classList.remove('hidden');
                }
            } else {
                if (tagHintElement) tagHintElement.classList.add('hidden');
            }
        });
    }

    // --- Modal Logic ---
    const openAddModal = () => {
        editingTaskId = null;
        taskForm.reset();
        currentSubtasks = []; // Reset subtasks
        currentTags = []; // Reset tags
        renderSubtasksPreview();
        renderTagsPreview();
        updateTagSuggestions(); // Populate datalist
        modalTitle.textContent = 'إضافة مهمة جديدة';
        modalSubmitBtn.textContent = 'إضافة المهمة';
        modal.classList.remove('hidden');
        document.getElementById('task-title').focus();

        // Hide hint initially when opening modal
        if (tagHintElement) tagHintElement.classList.add('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        editingTaskId = null;
        currentSubtasks = [];
        currentTags = [];
    };

    // Tags UI Logic
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagsListPreview = document.getElementById('selected-tags-container');

    const handleAddTag = () => {
        const name = newTagNameInput.value.trim();
        let color = newTagColorInput.value;

        if (!name) return;

        // 1. Check if already added to CURRENT task
        if (currentTags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
            alert('هذا الوسم مضاف بالفعل لهذه المهمة.');
            return;
        }

        // 2. Check GLOBAL tags to enforce color consistency
        const globalTags = getGlobalTags();
        if (globalTags.has(name.toLowerCase())) {
            const existing = globalTags.get(name.toLowerCase());
            // Check if user is trying to use a different color
            if (existing.color.toLowerCase() !== color.toLowerCase()) {
                alert('لا يمكنك تغيير لون هذا الوسم الموجود مسبقاً.');
                color = existing.color;
            } else {
                color = existing.color;
            }
        }

        currentTags.push({ name, color });
        renderTagsPreview();
        newTagNameInput.value = '';
        newTagNameInput.focus();

        // Hide Hint Permanently on successful add
        if (tagHintElement) {
            tagHintElement.classList.add('hidden');
            localStorage.setItem('tagHintDismissed', 'true');
        }
    };

    // Will attach this in the DOMContentLoaded or after HTML update. 
    // Since we are replacing lines where listeners are attached, we can allow this to be set up safely.
    // However, the elements addTagBtn etc don't exist in DOM yet. 
    // We should put this logic inside a setup function or simply replace lines where listeners are.

    const renderTagsPreview = () => {
        if (!tagsListPreview) return;
        tagsListPreview.innerHTML = '';
        currentTags.forEach((tag, index) => {
            const chip = document.createElement('span');
            chip.className = 'tag-chip';
            chip.style.backgroundColor = tag.color;
            // Contrast check for text color could be good, but simple for now
            chip.style.color = '#fff';
            chip.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
            chip.style.display = 'inline-flex';
            chip.style.alignItems = 'center';
            chip.style.cursor = 'default';

            chip.innerHTML = `${escapeHTML(tag.name)} <button type="button" class="remove-tag-btn" data-index="${index}" style="margin-right:5px;background:none;border:none;color:white;cursor:pointer;">&times;</button>`;
            tagsListPreview.appendChild(chip);
        });

        tagsListPreview.querySelectorAll('.remove-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                currentTags.splice(index, 1);
                renderTagsPreview();
            });
        });
    };

    // Subtask UI Logic in Modal
    const addSubtaskBtn = document.getElementById('add-subtask-btn');
    const newSubtaskInput = document.getElementById('new-subtask-input');
    const subtasksListPreview = document.getElementById('subtasks-list-preview');

    addSubtaskBtn.addEventListener('click', () => {
        const title = newSubtaskInput.value.trim();
        if (title) {
            currentSubtasks.push({ title, completed: false });
            newSubtaskInput.value = '';
            renderSubtasksPreview();
            newSubtaskInput.focus();
        }
    });

    // Allow adding subtasks with Enter key
    newSubtaskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            addSubtaskBtn.click();
        }
    });

    const renderSubtasksPreview = () => {
        subtasksListPreview.innerHTML = '';
        currentSubtasks.forEach((subtask, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${subtask.title}</span>
                <button type="button" class="remove-subtask-btn" data-index="${index}">×</button>
            `;
            subtasksListPreview.appendChild(li);
        });

        // Add event listeners for removal
        subtasksListPreview.querySelectorAll('.remove-subtask-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                currentSubtasks.splice(index, 1);
                renderSubtasksPreview();
            });
        });
    };

    addTaskBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Sidebar Toggle Logic ---
    const initializeSidebar = () => {
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const isMobile = window.innerWidth <= 768;

        // Load saved sidebar state (only for desktop)
        if (!isMobile && localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('sidebar-collapsed');
        }

        // Function to open sidebar (mobile)
        const openSidebar = () => {
            sidebar.classList.add('sidebar-open');
            sidebarOverlay.classList.add('active');
            document.body.classList.add('sidebar-open');
        };

        // Function to close sidebar (mobile)
        const closeSidebar = () => {
            sidebar.classList.remove('sidebar-open');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        };

        // Desktop toggle (collapse/expand)
        toggleBtn.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.toggle('sidebar-collapsed');
                if (sidebar.classList.contains('sidebar-collapsed')) {
                    localStorage.setItem('sidebarCollapsed', 'true');
                } else {
                    localStorage.setItem('sidebarCollapsed', 'false');
                }
            } else {
                // On mobile, toggle button closes the sidebar
                closeSidebar();
            }
        });

        // Mobile menu button
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                if (sidebar.classList.contains('sidebar-open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        // Close sidebar when clicking overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // Close sidebar when clicking on a link (mobile)
        if (isMobile) {
            const sidebarLinks = sidebar.querySelectorAll('nav a');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(closeSidebar, 300); // Small delay for better UX
                });
            });
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    // Desktop: remove mobile classes
                    sidebar.classList.remove('sidebar-open');
                    sidebarOverlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                    // Restore collapsed state if saved
                    if (localStorage.getItem('sidebarCollapsed') === 'true') {
                        sidebar.classList.add('sidebar-collapsed');
                    }
                } else {
                    // Mobile: ensure sidebar is closed by default
                    sidebar.classList.remove('sidebar-open', 'sidebar-collapsed');
                    sidebarOverlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }, 250);
        });
    };

    // --- Confirm Delete Modal Logic ---
    const openConfirmDeleteModal = (id) => {
        taskToDeleteId = id;
        confirmDeleteModal.classList.remove('hidden');
    };
    const closeConfirmDeleteModal = () => {
        taskToDeleteId = null;
        confirmDeleteModal.classList.add('hidden');
    };
    cancelDeleteBtn.addEventListener('click', closeConfirmDeleteModal);
    confirmDeleteBtn.addEventListener('click', () => {
        softDeleteTask(taskToDeleteId);
        closeConfirmDeleteModal();
    });

    // --- Data Handling ---
    const fetchTasksFromFirestore = async () => {
        if (!tasksCollection) return [];
        try {
            const snapshot = await tasksCollection.get();
            localTasksCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return localTasksCache;
        } catch (error) {
            console.error("Error fetching tasks: ", error);
            return [];
        }
    };

    const autoDeleteOldTasks = async () => {
        if (!tasksCollection) return;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Create a Firestore timestamp from the date
        const threshold = firebase.firestore.Timestamp.fromDate(thirtyDaysAgo);

        // Query for tasks that were soft-deleted more than 30 days ago
        const query = tasksCollection.where('isDeleted', '==', true).where('deletedAt', '<=', threshold);

        const snapshot = await query.get();
        if (snapshot.empty) return; // No old tasks to delete

        // Use a batch to delete all found documents efficiently
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    };

    // --- Rendering ---
    const renderTasks = async (isFiltering = false) => {
        const allTasks = await fetchTasksFromFirestore();

        checkForDueDates(allTasks); // Check and display alerts

        // Calculate counts for *active* categories
        const activeTasks = allTasks.filter(task => !task.completed && !task.isDeleted);
        const allCount = activeTasks.length;
        const urgentCount = activeTasks.filter(task => task.priority === 'urgent').length;
        const importantCount = activeTasks.filter(task => task.priority === 'important').length;
        const normalCount = activeTasks.filter(task => task.priority === 'normal').length;

        // Update counts in sidebar
        if (document.getElementById('count-all')) document.getElementById('count-all').textContent = `(${allCount})`;
        if (document.getElementById('count-urgent')) document.getElementById('count-urgent').textContent = `(${urgentCount})`;
        if (document.getElementById('count-important')) document.getElementById('count-important').textContent = `(${importantCount})`;
        if (document.getElementById('count-normal')) document.getElementById('count-normal').textContent = `(${normalCount})`;

        // 1. Search
        let processedTasks = allTasks;
        if (currentSearchTerm) {
            const searchTerm = currentSearchTerm.toLowerCase().trim();
            if (searchTerm.startsWith('أولوية:')) {
                const priority = searchTerm.substring(7).trim(); // Get text after "أولوية:"
                const priorityMap = { 'عاجلة': 'urgent', 'مهمة': 'important', 'عادية': 'normal' };
                const searchPriority = priorityMap[priority];
                if (searchPriority) {
                    processedTasks = processedTasks.filter(task => task.priority === searchPriority);
                }
            } else if (searchTerm.startsWith('تاريخ:')) {
                const dateStr = searchTerm.substring(6).trim(); // Get text after "تاريخ:"
                // This will find tasks that fall on that specific date
                processedTasks = processedTasks.filter(task => {
                    if (!task.dueDate) return false;
                    // Compare only the date part, ignoring time
                    const taskDate = task.dueDate.substring(0, 10);
                    return taskDate === dateStr;
                });
            } else {
                // Default text search
                processedTasks = processedTasks.filter(task =>
                    task.title.toLowerCase().includes(searchTerm) ||
                    task.description.toLowerCase().includes(searchTerm)
                );
            }
        }

        // 2. Filter
        if (currentFilter === 'deleted') { // If we are in the deleted view
            processedTasks = processedTasks.filter(task => task.isDeleted);
        } else { // For all other views ('all', 'urgent', etc.)
            // First, always exclude deleted tasks
            processedTasks = processedTasks.filter(task => !task.isDeleted);

            // Then, if a specific category is selected, apply that filter
            if (currentFilter !== 'all') {
                if (currentFilter.startsWith('tag:')) {
                    // Tag Filter
                    const targetTag = currentFilter.substring(4);
                    // Handle both legacy string tags and new object tags
                    processedTasks = processedTasks.filter(task => {
                        if (!task.tags) return false;
                        return task.tags.some(t => {
                            const tagName = typeof t === 'string' ? t : t.name;
                            return tagName === targetTag;
                        });
                    });
                } else {
                    // Priority Filter
                    processedTasks = processedTasks.filter(task => task.priority === currentFilter);
                }
            }
        }

        // --- Populate Sidebar Tags ---
        const tagsFiltersContainer = document.getElementById('tags-filters');
        if (tagsFiltersContainer) {
            // Collect unique tags from *active* tasks
            const uniqueTags = new Map(); // Name -> Color
            activeTasks.forEach(task => {
                if (task.tags) {
                    task.tags.forEach(tag => {
                        if (typeof tag === 'string') {
                            if (!uniqueTags.has(tag)) uniqueTags.set(tag, '#e0e0e0'); // Default grey
                        } else {
                            if (!uniqueTags.has(tag.name)) uniqueTags.set(tag.name, tag.color);
                        }
                    });
                }
            });

            tagsFiltersContainer.innerHTML = '';

            uniqueTags.forEach((color, tagName) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'filter-btn';
                a.dataset.filter = `tag:${tagName}`;
                if (currentFilter === `tag:${tagName}`) a.classList.add('active');

                // Dynamic style for the dot
                const dotStyle = `background-color: ${color}`;

                a.innerHTML = `
                    <span class="tag-color-dot" style="${dotStyle}"></span>
                    <span class="link-text">${escapeHTML(tagName)}</span>
                `;

                li.appendChild(a);
                tagsFiltersContainer.appendChild(li);
            });
        }

        // 3. Sort
        const priorityOrder = { 'urgent': 1, 'important': 2, 'normal': 3 };
        processedTasks.sort((a, b) => {
            // Completed tasks always go to the bottom
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // Sort by selected criteria for active tasks
            if (currentSort === 'priority') {
                return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
            }
            if (currentSort === 'creation') {
                // Newest first
                return (b.createdAt || 0) - (a.createdAt || 0);
            }
            // Default sort by due date
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            return dateA - dateB;
        });

        // 4. Render
        const renderLogic = () => {
            tasksList.innerHTML = ''; // Clear the list

            // Inject Empty Trash Button if in deleted view
            if (currentFilter === 'deleted' && processedTasks.length > 0) {
                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'trash-controls';
                controlsDiv.innerHTML = `
                    <p class="deleted-info-message">سيتم حذف المهام نهائياً بعد 30 يوماً.</p>
                    <button id="empty-trash-btn" class="btn btn-danger-soft">إفراغ سلة المحذوفات (${processedTasks.length})</button>
                    <hr>
                 `;
                tasksList.appendChild(controlsDiv);

                // Add listener
                setTimeout(() => {
                    const btn = document.getElementById('empty-trash-btn');
                    if (btn) btn.addEventListener('click', emptyTrash);
                }, 0);
            } else if (currentFilter === 'deleted') {
                const deletedInfoMessage = `<p class="deleted-info-message">سيتم حذف المهام نهائياً بعد 30 يوماً من وجودها في سلة المحذوفات.</p>`;
                tasksList.innerHTML = deletedInfoMessage;
            }

            if (processedTasks.length === 0) {
                const emptyMessage = getEmptyStateMessage(allTasks.length, currentFilter, currentSearchTerm);
                tasksList.innerHTML += `<p class="empty-state-message">${emptyMessage}</p>`;
                return;
            }

            processedTasks.forEach(task => {
                const taskCard = createTaskCard(task);
                tasksList.appendChild(taskCard);

                // Apply animation for newly added or filtered-in tasks
                if (task.id === window.newlyAddedTaskId) {
                    taskCard.classList.add('newly-added');
                    delete window.newlyAddedTaskId; // Clean up
                } else if (isFiltering) {
                    taskCard.classList.add('is-filtering-in');
                }
            });
        };

        if (isFiltering) {
            // Animate out old tasks
            const cards = tasksList.querySelectorAll('.task-card');
            if (cards.length > 0) {
                cards.forEach(card => card.classList.add('is-filtering-out'));
                // Wait for animation to finish before rendering new tasks
                setTimeout(renderLogic, 300);
            } else {
                // If there are no cards, just render immediately
                renderLogic();
            }
        } else {
            // If not filtering (e.g., initial load, adding task), render immediately
            renderLogic();
        }
    };

    const getEmptyStateMessage = (totalTasksCount, filter, searchTerm) => {
        if (searchTerm) {
            return 'هممم، لا توجد مهام بهذا الاسم. هل جربت كلمة بحث أخرى؟';
        }
        if (filter === 'deleted') {
            return 'سلة المحذوفات فارغة. عمل نظيف!';
        }
        if (filter === 'all' && totalTasksCount === 0) {
            return 'لا توجد مهام بعد. هيا أضف مهمتك الأولى من الزر أدناه!';
        }
        if (filter !== 'all') {
            return 'رائع! لا توجد مهام في هذا القسم حالياً.';
        }
        return 'يبدو أن هذا القسم فارغ. ربما تجرب فلترًا آخر؟';
    };

    const checkForDueDates = (tasks) => {
        alertsContainer.innerHTML = '';

        // If we are in the deleted view, don't show any alerts.
        if (currentFilter === 'deleted') {
            return;
        }

        const now = new Date();
        const upcomingLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        const alerts = [];

        // Sort alerts to show overdue ones first
        const sortedTasks = tasks.sort((a, b) => (new Date(a.dueDate) > new Date(b.dueDate) ? 1 : -1));

        sortedTasks.forEach(task => {
            if (task.dueDate && !task.completed && !task.isDeleted) {
                const dueDate = new Date(task.dueDate);
                if (dueDate < now) {
                    alerts.push({ type: 'overdue', message: `فات موعد استحقاق مهمة: <strong>${escapeHTML(task.title)}</strong>.` });
                } else if (dueDate < upcomingLimit) {
                    alerts.push({ type: 'due-soon', message: `مهمة <strong>${escapeHTML(task.title)}</strong> مستحقة خلال 24 ساعة.` });
                }
            }
        });

        if (alerts.length > 0) {
            alerts.forEach(alertInfo => {
                const alertHTML = `
                    <div class="alert alert-${alertInfo.type}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="alert-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
                        <span>${alertInfo.message}</span>
                    </div>`;
                alertsContainer.innerHTML += alertHTML;
            });
        }
    };

    const createTaskCard = (task) => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.priority} ${task.completed ? 'completed' : ''} ${task.isDeleted ? 'deleted-task' : ''}`;
        taskCard.dataset.id = task.id;

        const formattedDate = task.dueDate
            ? new Date(task.dueDate).toLocaleString('ar-EG', { // Using ar-EG for better Gregorian support
                year: 'numeric', month: 'long', day: 'numeric',
                ...(task.dueDate.includes('T') && { hour: 'numeric', minute: 'numeric', hour12: true }) // Add time only if it exists
            })
            : 'بدون تاريخ استحقاق';

        // Due date status for styling
        let dueDateStatus = '';
        if (task.dueDate && !task.completed && !task.isDeleted) { // Check if task is active before showing due date alerts
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            const upcomingLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            if (dueDate < now) {
                dueDateStatus = 'overdue';
            } else if (dueDate < upcomingLimit) {
                dueDateStatus = 'due-soon';
            }
        }

        let deleteTimerHTML = '';
        if (task.isDeleted && task.deletedAt) {
            const deletedDate = task.deletedAt.toDate(); // Convert Firestore Timestamp to JS Date
            const expiryDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
            deleteTimerHTML = `<span class="delete-timer">سيتم الحذف النهائي خلال ${daysLeft > 0 ? daysLeft : 0} يوم</span>`;
        }

        // --- Tags HTML ---
        let tagsHTML = '';
        if (task.tags && task.tags.length > 0) {
            tagsHTML = `<div class="task-tags">${task.tags.map(tag => {
                const tagName = typeof tag === 'string' ? tag : tag.name;
                const tagColor = typeof tag === 'string' ? '#e0e0e0' : tag.color;
                // Add white text for better contrast if color is dark, or dynamic logic. 
                // For now, simpler to assume users pick reasonable colors or we add a text-shadow.
                const style = `background-color: ${tagColor}; color: white; text-shadow: 0 1px 1px rgba(0,0,0,0.2);`;
                return `<span class="tag-chip" style="${style}">${escapeHTML(tagName)}</span>`;
            }).join('')}</div>`;
        }


        // --- Subtasks HTML ---
        let subtasksHTML = '';
        if (task.subtasks && task.subtasks.length > 0) {
            subtasksHTML = '<div class="subtasks-container">';

            // Progress Bar
            const completedCount = task.subtasks.filter(s => s.completed).length;
            const progressPercent = (completedCount / task.subtasks.length) * 100;
            if (task.subtasks.length > 0) {
                subtasksHTML += `
                 <div class="subtask-progress">
                    <div class="subtask-progress-bar" style="width: ${progressPercent}%"></div>
                 </div>`;
            }

            task.subtasks.forEach((subtask, index) => {
                subtasksHTML += `
                    <div class="subtask-item ${subtask.completed ? 'completed' : ''}" data-index="${index}">
                        ${!task.isDeleted ? `<input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}>` : ''}
                        <span>${escapeHTML(subtask.title)}</span>
                    </div>`;
            });
            subtasksHTML += '</div>';
        }

        const actionsHTML = task.isDeleted
            ? `
            <button class="action-btn restore-btn" title="استعادة المهمة">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8H12z"></path></svg>
            </button>
            <button class="action-btn delete-btn" title="حذف نهائي">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
        `
            : `
            <button class="action-btn edit-btn" title="تعديل المهمة">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            </button>
            <button class="action-btn delete-btn" title="حذف المهمة">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
        `;

        taskCard.innerHTML = `
        <div class="task-header">
            ${!task.isDeleted ? '<button class="complete-btn-circle" title="إكمال المهمة"></button>' : ''}
            <div class="task-title-container">
                <span class="priority-dot"></span>
                <h3>${escapeHTML(task.title)}</h3>
            </div>
            <div class="task-actions">${actionsHTML}</div>
        </div>
        <p>${escapeHTML(task.description)}</p>
        ${tagsHTML}
        ${subtasksHTML}
        <div class="task-meta">
            ${task.dueDate && !task.isDeleted ? `
                <div class="due-date-badge ${dueDateStatus}">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>
                    <span>${formattedDate}</span>
                </div>
            ` : ''}
            ${deleteTimerHTML}
        </div>
    `;

        // --- Add Event Listeners to card buttons ---
        if (task.isDeleted) {
            taskCard.querySelector('.restore-btn').addEventListener('click', () => restoreTask(task.id));
            taskCard.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`هل أنت متأكد من الحذف النهائي لمهمة: "${task.title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                    deleteTaskPermanently(task.id);
                }
            });
        } else {
            taskCard.querySelector('.complete-btn-circle').addEventListener('click', () => {
                toggleTaskComplete(task.id);
            });

            taskCard.querySelector('.edit-btn').addEventListener('click', () => {
                openEditModal(task.id);
            });

            taskCard.querySelector('.delete-btn').addEventListener('click', () => {
                // Open the custom confirmation modal instead of the browser's confirm
                openConfirmDeleteModal(task.id);
            });

            // Subtask Checkboxes Listeners
            taskCard.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const index = parseInt(e.target.closest('.subtask-item').dataset.index);
                    toggleSubtaskComplete(task.id, index);
                });
            });
        }

        return taskCard;
    };

    const periodicCheck = () => {
        if (!localTasksCache || localTasksCache.length === 0 || currentFilter === 'deleted') return;

        // 1. Update the top alerts
        checkForDueDates(localTasksCache);

        // 2. Update individual card badges
        const now = new Date();
        const upcomingLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        document.querySelectorAll('.task-card:not(.completed):not(.deleted-task)').forEach(card => {
            const taskId = card.dataset.id;
            const task = localTasksCache.find(t => t.id === taskId);
            if (!task || !task.dueDate) return;

            const dueDate = new Date(task.dueDate);
            const badge = card.querySelector('.due-date-badge');
            if (!badge) return;

            // Remove old statuses and apply the new one
            badge.classList.remove('overdue', 'due-soon');
            if (dueDate < now) badge.classList.add('overdue');
            else if (dueDate < upcomingLimit) badge.classList.add('due-soon');
        });
    };

    const softDeleteTask = async (id) => {
        if (!tasksCollection) return;
        await tasksCollection.doc(id).update({ isDeleted: true, deletedAt: firebase.firestore.FieldValue.serverTimestamp() });
        renderTasks();
    };

    const restoreTask = async (id) => {
        if (!tasksCollection) return;
        await tasksCollection.doc(id).update({ isDeleted: false, deletedAt: null }); // Remove deletion date
        renderTasks();
    };

    const deleteTaskPermanently = async (id) => {
        if (!tasksCollection) return;
        await tasksCollection.doc(id).delete();
        renderTasks();
    };




    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('task-title');
        const dateInput = document.getElementById('task-due-date').value;
        const timeInput = document.getElementById('task-due-time').value;
        // Tags are now handled via currentTags array (global/state) - need to update this logic later in this turn
        // For now, removing recurrence first.
        const title = titleInput.value.trim();

        if (title === '') {
            alert('حقل العنوان مطلوب.');
            return;
        }

        const combinedDueDate = dateInput && timeInput
            ? `${dateInput}T${timeInput}`
            : dateInput;

        try {
            // NOTE: tags are temporarily using the old input method until we update that in the next step.
            // But we removed recurrence.

            if (editingTaskId) {
                // --- Edit existing task ---
                const taskRef = tasksCollection.doc(editingTaskId);
                await taskRef.update({
                    title,
                    description: document.getElementById('task-desc').value.trim(),
                    dueDate: combinedDueDate,
                    priority: document.getElementById('task-priority').value,
                    tags: currentTags, // Updated to use currentTags object array
                    subtasks: currentSubtasks
                });
                window.newlyAddedTaskId = editingTaskId;

            } else {
                // --- Add new task ---
                const newTask = {
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    title,
                    description: document.getElementById('task-desc').value.trim(),
                    dueDate: combinedDueDate,
                    priority: document.getElementById('task-priority').value,
                    completed: false,
                    isDeleted: false,
                    tags: currentTags, // Updated to use currentTags object array
                    subtasks: currentSubtasks
                };
                const docRef = await tasksCollection.add(newTask);
                window.newlyAddedTaskId = docRef.id;
            }

            renderTasks();
            taskForm.reset();
            closeModal();
        } catch (error) {
            console.error("Error saving task: ", error);
            alert("حدث خطأ أثناء حفظ المهمة.");
        }
    };


    const toggleSubtaskComplete = async (taskId, subtaskIndex) => {
        if (!tasksCollection) return;
        const taskRef = tasksCollection.doc(taskId);
        const taskDoc = await taskRef.get();
        const task = taskDoc.data();

        if (task.subtasks && task.subtasks[subtaskIndex]) {
            task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
            const allSubtasksCompleted = task.subtasks.every(sub => sub.completed);
            const updates = { subtasks: task.subtasks };

            if (allSubtasksCompleted && !task.completed) {
                updates.completed = true;
            }
            else if (!allSubtasksCompleted && task.completed) {
                updates.completed = false;
            }

            await taskRef.update(updates);
            renderTasks();
        }
    };

    const openEditModal = (id) => {
        const taskToEdit = localTasksCache.find(task => task.id === id);
        if (!taskToEdit) return;

        editingTaskId = id;
        modalTitle.textContent = 'تعديل المهمة';
        modalSubmitBtn.textContent = 'حفظ التعديلات';
        document.getElementById('task-title').value = taskToEdit.title;
        document.getElementById('task-desc').value = taskToEdit.description;

        if (taskToEdit.dueDate && taskToEdit.dueDate.includes('T')) {
            const [datePart, timePart] = taskToEdit.dueDate.split('T');
            document.getElementById('task-due-date').value = datePart;
            document.getElementById('task-due-time').value = timePart;
        } else {
            document.getElementById('task-due-date').value = taskToEdit.dueDate || '';
        }

        document.getElementById('task-priority').value = taskToEdit.priority;

        // Tags and Subtasks Population
        currentTags = taskToEdit.tags ? (Array.isArray(taskToEdit.tags) && typeof taskToEdit.tags[0] === 'object' ? [...taskToEdit.tags] : taskToEdit.tags.map(t => ({ name: t, color: '#e0e0e0' }))) : []; // Handle legacy
        renderTagsPreview(); // We will implement this

        currentSubtasks = taskToEdit.subtasks ? [...taskToEdit.subtasks] : [];
        renderSubtasksPreview();

        modal.classList.remove('hidden');
    };

    const handleTaskCompletion = async (task, taskId) => {
        // Simplified Logic: Just toggle completion. Recurrence is gone.
        const taskRef = tasksCollection.doc(taskId);
        const newStatus = !task.completed;
        await taskRef.update({ completed: newStatus });

        // Update UI logic
        const cardToUpdate = tasksList.querySelector(`[data-id='${taskId}']`);
        if (cardToUpdate) {
            cardToUpdate.classList.toggle('completed', newStatus);
            setTimeout(() => { renderTasks(); }, 1000);
        }
    };

    const toggleTaskComplete = async (id) => {
        if (!tasksCollection) return;
        const taskRef = tasksCollection.doc(id);
        const taskDoc = await taskRef.get();
        const task = taskDoc.data();

        await handleTaskCompletion(task, id);
    };

    // --- Filtering and Sorting ---
    document.getElementById('sidebar').addEventListener('click', (e) => {
        const targetLink = e.target.closest('a.filter-btn');

        if (targetLink) {
            // Prevent default link behavior only for filter buttons
            e.preventDefault();
            // Remove 'active' class from any currently active filter button in the entire sidebar
            document.querySelector('#sidebar a.filter-btn.active')?.classList.remove('active');

            // Add 'active' class to the clicked button
            targetLink.classList.add('active');

            // Update the state and re-render the tasks
            currentFilter = targetLink.dataset.filter;
            renderTasks(true); // Pass true to indicate filtering
        }
    });

    sortButtons.addEventListener('click', (e) => {
        const targetButton = e.target.closest('button.sort-btn');
        if (targetButton) {
            // Update active class
            const currentActive = sortButtons.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            e.target.classList.add('active');
            // Update state and re-render
            currentSort = e.target.dataset.sort;
            renderTasks(true); // Pass true to indicate filtering
        }
    });

    // Search listener
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderTasks(true); // Pass true to indicate filtering
    });

    // --- View Toggler ---
    const applyViewPreference = () => {
        // Remove active class from all view buttons
        viewOptions.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        // Add active class to the correct button
        viewOptions.querySelector(`[data-view="${currentView}"]`).classList.add('active');

        // Apply class to the tasks list container
        if (currentView === 'grid') {
            tasksList.classList.add('grid-view');
        } else {
            tasksList.classList.remove('grid-view');
        }
    };

    viewOptions.addEventListener('click', (e) => {
        const targetButton = e.target.closest('button.view-btn');
        if (targetButton && targetButton.dataset.view !== currentView) {
            currentView = targetButton.dataset.view;
            localStorage.setItem('taskView', currentView); // Save preference
            applyViewPreference();
        }
    });

    // --- Export and Import Logic ---
    const convertToCSV = (tasks) => {
        const headers = ['title', 'description', 'dueDate', 'priority', 'completed'];
        const rows = tasks.map(task => {
            // Sanitize data for CSV: wrap in quotes and escape existing quotes
            const escape = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
            return [
                escape(task.title),
                escape(task.description),
                escape(task.dueDate),
                escape(task.priority),
                escape(task.completed)
            ].join(',');
        });
        return [headers.join(','), ...rows].join('\r\n');
    };

    exportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // We use the local cache which is already filtered for non-deleted tasks
        const tasksToExport = localTasksCache.filter(task => !task.isDeleted);
        if (tasksToExport.length === 0) {
            alert('لا توجد مهام لتصديرها.');
            return;
        }
        const csvContent = convertToCSV(tasksToExport);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'tasks.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        accountMenu.classList.add('hidden');
    });

    importForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = csvFileInput.files[0];
        if (!file) {
            importStatus.textContent = 'الرجاء اختيار ملف أولاً.';
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csv = event.target.result;
            const lines = csv.split(/\r\n|\n/);
            const headers = lines[0].split(',').map(h => h.trim());
            const tasksToImport = [];

            // Basic validation for headers
            const expectedHeaders = ['title', 'description', 'dueDate', 'priority', 'completed'];
            if (!expectedHeaders.every(h => headers.includes(h))) {
                importStatus.textContent = 'خطأ: الملف غير متوافق. تأكد من أن الأعمدة صحيحة.';
                importStatus.style.color = 'red';
                return;
            }

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i]) continue;
                // A simple regex to handle quoted commas
                const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                const taskData = {};
                for (let j = 0; j < headers.length; j++) {
                    let value = (values[j] || '').trim();
                    // Remove quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1).replace(/""/g, '"');
                    }
                    // Convert 'true'/'false' strings to boolean
                    if (headers[j] === 'completed') {
                        value = value.toLowerCase() === 'true';
                    }
                    taskData[headers[j]] = value;
                }

                if (taskData.title) { // Only import if there's a title
                    tasksToImport.push({
                        title: taskData.title,
                        description: taskData.description || '',
                        dueDate: taskData.dueDate || '',
                        priority: taskData.priority || 'normal',
                        completed: taskData.completed || false,
                        isDeleted: false,
                        recurrence: 'none',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                }
            }

            if (tasksToImport.length > 0) {
                importStatus.textContent = `جاري استيراد ${tasksToImport.length} مهمة...`;
                importStatus.style.color = 'blue';
                const batch = db.batch();
                tasksToImport.forEach(task => {
                    const docRef = tasksCollection.doc(); // Automatically generate unique ID
                    batch.set(docRef, task);
                });
                await batch.commit();
                importStatus.textContent = `تم استيراد ${tasksToImport.length} مهمة بنجاح!`;
                importStatus.style.color = 'green';
                await renderTasks(); // Refresh the list
            }
        };
        reader.readAsText(file);
    });

    // --- Utility ---
    const escapeHTML = (str) => {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    };



    // --- Pomodoro Timer Logic ---
    let timerInterval;
    let timeLeft = 25 * 60; // Default 25 minutes
    let isTimerRunning = false;

    // Elements
    const pomodoroWidget = document.getElementById('pomodoro-widget');
    const pomodoroToggleBtn = document.getElementById('pomodoro-toggle-btn');
    const closePomodoroBtn = document.getElementById('close-pomodoro');
    const minimizePomodoroBtn = document.getElementById('minimize-pomodoro');
    const pomodoroMinimized = document.getElementById('pomodoro-minimized');
    const miniTimerDisplay = document.getElementById('mini-timer-display');

    const timerDisplay = document.getElementById('pomodoro-timer');
    const startBtn = document.getElementById('start-timer-btn');
    const pauseBtn = document.getElementById('pause-timer-btn');
    const resetBtn = document.getElementById('reset-timer-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // UI Logic (Toggle, Minimize, Drag)
    pomodoroToggleBtn.addEventListener('click', () => {
        pomodoroWidget.classList.toggle('hidden');
    });

    closePomodoroBtn.addEventListener('click', () => {
        pomodoroWidget.classList.add('hidden');
    });

    minimizePomodoroBtn.addEventListener('click', () => {
        pomodoroWidget.classList.toggle('minimized');
        minimizePomodoroBtn.textContent = pomodoroWidget.classList.contains('minimized') ? '□' : '_';
    });

    pomodoroMinimized.addEventListener('click', () => {
        pomodoroWidget.classList.remove('minimized');
        minimizePomodoroBtn.textContent = '_';
    });

    // Draggable Logic
    const dragHandle = pomodoroWidget.querySelector('.drag-handle');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === dragHandle) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, pomodoroWidget);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Timer Logic
    const updateDisplay = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        timerDisplay.textContent = timeString;
        miniTimerDisplay.textContent = timeString;

        // Update browser title logic preserved
        if (isTimerRunning) {
            document.title = `${timeString} - 🍅`;
        } else {
            document.title = 'قائمة المهام - TaskMaster';
        }
    };

    // Toggle Logic
    const toggleBtn = document.getElementById('toggle-timer-btn');

    const updateToggleButton = () => {
        toggleBtn.textContent = isTimerRunning ? '⏸' : '▶';
        toggleBtn.title = isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل';
        // Optional: formatting changes if needed
    };

    const toggleTimer = () => {
        if (isTimerRunning) {
            // Pause
            clearInterval(timerInterval);
            isTimerRunning = false;
        } else {
            // Start
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    updateToggleButton();
                    // Play sound or notification here
                    alert('انتهى الوقت! خذ قسطاً من الراحة.');
                    document.title = 'انتهى الوقت! - TaskMaster';
                }
            }, 1000);
        }
        updateToggleButton();
    };


    const resetTimer = () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        // Reset to currently selected mode
        const activeMode = document.querySelector('.mode-btn.active');
        timeLeft = parseInt(activeMode.dataset.time) * 60;
        updateDisplay();
        updateToggleButton();
    };

    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            clearInterval(timerInterval);
            isTimerRunning = false;
            updateToggleButton(); // Ensure button shows 'Play'

            timeLeft = parseInt(e.target.dataset.time) * 60;
            updateDisplay();
        });
    });


    // --- Initial Load ---
    taskForm.addEventListener('submit', handleFormSubmit);

    // Add Tag Button Listener
    const addTagBtnDOM = document.getElementById('add-tag-btn');
    if (addTagBtnDOM) {
        addTagBtnDOM.addEventListener('click', handleAddTag);
    }

    // --- Tour / Onboarding Logic ---
    // --- Tour / Onboarding Logic ---
    // --- Tour / Onboarding Logic ---
    window.startTour = () => {
        const tourOverlay = document.getElementById('tour-overlay');
        const step1 = document.getElementById('tour-step-1');
        const step2 = document.getElementById('tour-step-2');
        const step3 = document.getElementById('tour-step-3'); // New Step 3
        const fab = document.querySelector('.fab');
        const sidebar = document.getElementById('sidebar');
        const accountMenuContainer = document.querySelector('.account-menu-container'); // To highlight account button
        const nextBtn1 = document.getElementById('tour-next-1');
        const nextBtn2 = document.getElementById('tour-next-2'); // New Next Button
        const addTaskModal = document.getElementById('add-task-modal');

        if (!tourOverlay || !fab || !sidebar) return;

        // Reset state
        tourOverlay.classList.remove('hidden');
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        if (step3) step3.classList.add('hidden');

        fab.classList.add('tour-highlight-fab');
        sidebar.classList.remove('tour-highlight-sidebar');
        if (accountMenuContainer) accountMenuContainer.classList.remove('tour-highlight-fab');

        // Transitions using Arrow Functions for Reusability
        const transitionToStep2 = () => {
            fab.removeEventListener('click', onTourFabClick);
            step1.classList.add('hidden');
            fab.classList.remove('tour-highlight-fab');
            step2.classList.remove('hidden');
            sidebar.classList.add('tour-highlight-sidebar');
        };

        const transitionToStep3 = () => {
            step2.classList.add('hidden');
            if (step3) {
                step3.classList.remove('hidden');
                if (accountMenuContainer) {
                    accountMenuContainer.classList.add('tour-highlight-element');
                }
            } else {
                endTour();
            }
        };

        const onTourFabClick = () => {
            tourOverlay.classList.add('hidden');
            fab.classList.remove('tour-highlight-fab');

            const checkModalClosed = setInterval(() => {
                if (addTaskModal.classList.contains('hidden')) {
                    clearInterval(checkModalClosed);
                    // Instead of reshowing step 1 then step 2 manually, just go to Step 2 directly
                    // But wait, the original logic showed Step 1 briefly? No, it hid Step 1 THEN removed overlay.
                    // Recovering from modal closing -> Show overlay & Step 2
                    tourOverlay.classList.remove('hidden');
                    step1.classList.add('hidden'); // Ensure step 1 is hidden
                    step2.classList.remove('hidden');
                    sidebar.classList.add('tour-highlight-sidebar');
                }
            }, 500);
            fab.removeEventListener('click', onTourFabClick);
        };
        fab.addEventListener('click', onTourFabClick);

        // Button Listeners
        nextBtn1.onclick = (e) => { e.stopPropagation(); transitionToStep2(); };
        if (nextBtn2) {
            nextBtn2.onclick = (e) => { e.stopPropagation(); transitionToStep3(); };
        }

        // Overlay Click Listener
        tourOverlay.onclick = (e) => {
            // Only proceed if clicking the background (overlay or step container), not buttons/text
            // Checking if target is one of the containers that covers the screen
            if (e.target.id === 'tour-overlay' || e.target.classList.contains('tour-step')) {
                if (!step1.classList.contains('hidden')) {
                    transitionToStep2();
                } else if (!step2.classList.contains('hidden')) {
                    transitionToStep3();
                } else if (step3 && !step3.classList.contains('hidden')) {
                    endTour();
                }
            }
        };

        // Finish Button (End Tour)
        document.getElementById('tour-finish').onclick = (e) => {
            e.stopPropagation();
            endTour();
        };

        // Skip Buttons
        document.querySelectorAll('.tour-skip-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                endTour();
            };
        });

        function endTour() {
            tourOverlay.classList.add('hidden');
            step1.classList.add('hidden');
            step2.classList.add('hidden');
            if (step3) step3.classList.add('hidden');

            fab.classList.remove('tour-highlight-fab');
            sidebar.classList.remove('tour-highlight-sidebar');
            if (accountMenuContainer) {
                accountMenuContainer.classList.remove('tour-highlight-element');
                accountMenuContainer.style.zIndex = '';
                accountMenuContainer.style.backgroundColor = '';
            }

            localStorage.setItem('tour_v2_completed', 'true');
            fab.removeEventListener('click', onTourFabClick);
        }
    };

    // Check restart flag or first time
    if (localStorage.getItem('restart_tour_flag') === 'true') {
        localStorage.removeItem('restart_tour_flag');
        setTimeout(window.startTour, 300);
    } else if (localStorage.getItem('tour_v2_completed') !== 'true') {
        setTimeout(window.startTour, 1000);
    }
});
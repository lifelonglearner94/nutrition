// NutriTrack App - Clean Implementation
console.log('🚀 NutriTrack JavaScript geladen');

class NutriTrackApp {
    constructor() {
        this.nutritionChart = null;
        this.currentSettings = { age: 24, weight: 70 };
        this.referenceIntake = null;
        this.currentDailyIntake = null;
        this.dailyEntryCount = 0;

        this.init();
    }

    init() {
        console.log('🔧 App wird initialisiert...');

        // Update current date
        this.updateCurrentDate();

        // Setup all event listeners
        this.setupEventListeners();

        // Load initial data
        this.loadInitialData();

        // Initialize chart
        this.initializeChart();

        // Setup theme
        this.setupTheme();

        console.log('✅ App erfolgreich initialisiert');
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const today = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            dateElement.textContent = today.toLocaleDateString('de-DE', options);
            console.log('📅 Datum aktualisiert');
        }
    }

    setupEventListeners() {
        console.log('🔗 Event Listeners werden eingerichtet...');

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                console.log('⚙️ Settings Button geklickt');
                this.openModal('settings-modal');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                console.log('🌙 Theme Toggle geklickt');
                this.toggleTheme();
            });
        }

        // Modal triggers (buttons with data-modal attribute)
        const modalTriggers = document.querySelectorAll('[data-modal]');
        console.log(`🎯 Gefunden ${modalTriggers.length} Modal Trigger`);

        modalTriggers.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.getAttribute('data-modal');
                console.log(`📝 Modal Trigger ${index + 1} geklickt: ${modalId}`);
                this.openModal(modalId);

                if (modalId === 'daily-entry-modal') {
                    this.populateFoodSelect();
                }
            });
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('[data-close]');
        console.log(`❌ Gefunden ${closeButtons.length} Close Buttons`);

        closeButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('❌ Close Button geklickt');
                const modal = btn.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Modal overlay
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                console.log('🔄 Overlay geklickt');
                this.closeAllModals();
            });
        }

        // Save buttons
        this.setupSaveButtons();

        // Chart controls
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const chartType = e.target.getAttribute('data-chart');
                this.updateChart(chartType);
            });
        });

        // Summary controls
        document.querySelectorAll('.summary-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.summary-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const viewType = e.target.getAttribute('data-view');
                this.updateNutrientsView(viewType);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        console.log('✅ Event Listeners eingerichtet');
    }

    setupSaveButtons() {
        // Settings save
        const saveSettings = document.getElementById('save-settings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => {
                console.log('💾 Save Settings geklickt');
                this.saveSettings();
            });
        }

        // Daily entry save
        const saveDailyEntry = document.getElementById('save-daily-entry');
        if (saveDailyEntry) {
            saveDailyEntry.addEventListener('click', () => {
                console.log('💾 Save Daily Entry geklickt');
                this.saveDailyEntry();
            });
        }

        // FDC save
        const saveFdc = document.getElementById('save-fdc');
        if (saveFdc) {
            saveFdc.addEventListener('click', () => {
                console.log('💾 Save FDC geklickt');
                this.saveFdcFood();
            });
        }

        // Manual food save
        const saveManualFood = document.getElementById('save-manual-food');
        if (saveManualFood) {
            saveManualFood.addEventListener('click', () => {
                console.log('💾 Save Manual Food geklickt');
                this.saveManualFood();
            });
        }
    }

    async loadInitialData() {
        console.log('📊 Lade initiale Daten...');

        try {
            this.showLoading(true);

            // Load settings
            await this.loadSettings();

            // Load reference intake
            await this.loadReferenceIntake();

            // Load daily intake
            await this.loadDailyIntake();

            // Load daily entry count
            await this.loadDailyEntryCount();

            // Refresh all UI components with loaded data
            this.refreshUI();

            console.log('✅ Initiale Daten geladen und UI aktualisiert');
        } catch (error) {
            console.error('❌ Fehler beim Laden der Daten:', error);
            this.showToast('Fehler beim Laden der Daten', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                this.currentSettings = await response.json();
                console.log('⚙️ Settings geladen:', this.currentSettings);

                // Update settings form
                const ageInput = document.getElementById('age');
                const weightInput = document.getElementById('weight');
                if (ageInput) ageInput.value = this.currentSettings.age;
                if (weightInput) weightInput.value = this.currentSettings.weight;
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Settings:', error);
        }
    }

    async loadReferenceIntake() {
        try {
            const response = await fetch('/api/reference-intake');
            if (response.ok) {
                this.referenceIntake = await response.json();
                console.log('📊 Reference Intake geladen:', this.referenceIntake);
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Reference Intake:', error);
        }
    }

    async loadDailyIntake() {
        try {
            const response = await fetch('/api/daily-intake');
            if (response.ok) {
                this.currentDailyIntake = await response.json();
                console.log('📝 Daily Intake geladen:', this.currentDailyIntake);
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Daily Intake:', error);
        }
    }

    async loadDailyEntryCount() {
        try {
            const response = await fetch('/api/daily-intake/count');
            if (response.ok) {
                const data = await response.json();
                this.dailyEntryCount = data.count || 0;
                console.log('📊 Daily Entry Count geladen:', this.dailyEntryCount);
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Daily Entry Count:', error);
        }
    }

    async populateFoodSelect() {
        try {
            const response = await fetch('/api/nutrient-database');
            if (response.ok) {
                const foods = await response.json();
                const select = document.getElementById('food-select');

                if (select) {
                    select.innerHTML = '<option value="">Lebensmittel auswählen...</option>';
                    foods.forEach((food) => {
                        const option = document.createElement('option');
                        option.value = food.Name;
                        option.textContent = food.Name;
                        select.appendChild(option);
                    });
                    console.log(`🍎 ${foods.length} Lebensmittel geladen`);
                }
            }
        } catch (error) {
            console.error('❌ Fehler beim Laden der Lebensmittel:', error);
            this.showToast('Fehler beim Laden der Lebensmittel', 'error');
        }
    }

    updateQuickStats() {
        console.log('📊 Updating Quick Stats with data:', this.currentDailyIntake);

        // Update calories consumed
        const caloriesElement = document.getElementById('calories-consumed');
        if (caloriesElement) {
            const calories = this.currentDailyIntake?.Kalorien || 0;
            caloriesElement.textContent = Math.round(calories);
        }

        // Update meals logged (count entries in daily intake)
        const mealsElement = document.getElementById('meals-logged');
        if (mealsElement) {
            mealsElement.textContent = this.dailyEntryCount;
        }

        // Update daily progress
        const progressElement = document.getElementById('daily-progress');
        if (progressElement && this.referenceIntake && this.currentDailyIntake) {
            const currentCalories = this.currentDailyIntake?.Kalorien || 0;
            const targetCalories = this.referenceIntake?.Kalorien || 2000;
            const progress = targetCalories > 0 ? Math.min((currentCalories / targetCalories) * 100, 100) : 0;
            progressElement.textContent = `${Math.round(progress)}%`;
        }

        console.log('📊 Quick Stats aktualisiert');
    }

    initializeChart() {
        const ctx = document.getElementById('nutrition-chart');
        if (!ctx) {
            console.log('⚠️ Chart Canvas nicht gefunden');
            return;
        }

        // Initialize with default data first
        this.nutritionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Kohlenhydrate', 'Fett', 'Andere'],
                datasets: [{
                    data: [25, 45, 20, 10],
                    backgroundColor: [
                        '#10b981',
                        '#6366f1',
                        '#f59e0b',
                        '#e5e7eb'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                }
            }
        });

        this.updateChartLegend();

        // Update with real data if available
        if (this.currentDailyIntake) {
            this.updateChart('nutrients');
        }

        console.log('📊 Chart initialisiert');
    }

    updateChart(type) {
        if (!this.nutritionChart) return;

        if (type === 'nutrients') {
            // Use real data if available
            if (this.currentDailyIntake) {
                const protein = this.currentDailyIntake.Protein || 0;
                const carbs = this.currentDailyIntake.Kohlenhydrate || 0;
                const fat = this.currentDailyIntake.Fett || 0;
                const total = protein + carbs + fat;

                if (total > 0) {
                    const proteinPct = (protein / total) * 100;
                    const carbsPct = (carbs / total) * 100;
                    const fatPct = (fat / total) * 100;

                    this.nutritionChart.data = {
                        labels: ['Protein', 'Kohlenhydrate', 'Fett'],
                        datasets: [{
                            data: [proteinPct, carbsPct, fatPct],
                            backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
                            borderWidth: 0,
                            cutout: '70%'
                        }]
                    };
                } else {
                    // Fallback to default data
                    this.nutritionChart.data = {
                        labels: ['Protein', 'Kohlenhydrate', 'Fett', 'Andere'],
                        datasets: [{
                            data: [25, 45, 20, 10],
                            backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#e5e7eb'],
                            borderWidth: 0,
                            cutout: '70%'
                        }]
                    };
                }
            } else {
                // Default data when no intake data available
                this.nutritionChart.data = {
                    labels: ['Protein', 'Kohlenhydrate', 'Fett', 'Andere'],
                    datasets: [{
                        data: [25, 45, 20, 10],
                        backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#e5e7eb'],
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                };
            }
        } else if (type === 'calories') {
            // Use real calorie data if available
            if (this.currentDailyIntake && this.referenceIntake) {
                const consumed = this.currentDailyIntake.Kalorien || 0;
                const target = this.referenceIntake.Kalorien || 2000;
                const remaining = Math.max(target - consumed, 0);

                this.nutritionChart.data = {
                    labels: ['Verbraucht', 'Verbleibt'],
                    datasets: [{
                        data: [consumed, remaining],
                        backgroundColor: ['#10b981', '#e5e7eb'],
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                };
            } else {
                // Default calorie data
                this.nutritionChart.data = {
                    labels: ['Verbraucht', 'Verbleibt'],
                    datasets: [{
                        data: [30, 70],
                        backgroundColor: ['#10b981', '#e5e7eb'],
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                };
            }
        }

        this.nutritionChart.update();
        this.updateChartLegend();
    }

    updateChartLegend() {
        const legendContainer = document.getElementById('chart-legend');
        if (!legendContainer || !this.nutritionChart) return;

        const data = this.nutritionChart.data;
        legendContainer.innerHTML = '';

        data.labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';

            const color = data.datasets[0].backgroundColor[index];
            const value = data.datasets[0].data[index];

            // Format the value based on the chart type
            let displayValue;
            if (label === 'Verbraucht' || label === 'Verbleibt') {
                // For calorie chart, show actual values
                displayValue = `${Math.round(value)} kcal`;
            } else {
                // For nutrient chart, show percentage
                displayValue = `${value.toFixed(1)}%`;
            }

            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${label}: ${displayValue}</span>
            `;

            legendContainer.appendChild(legendItem);
        });
    }

    updateNutrientsView(viewType) {
        console.log('🥗 Updating nutrients view with:', { referenceIntake: this.referenceIntake, currentDailyIntake: this.currentDailyIntake });

        if (!this.referenceIntake) {
            console.warn('⚠️ No reference intake data available');
            return;
        }

        const nutrientsGrid = document.getElementById('nutrients-grid');
        if (!nutrientsGrid) {
            console.warn('⚠️ Nutrients grid element not found');
            return;
        }

        nutrientsGrid.innerHTML = '';

        const nutrients = [
            { key: 'Kalorien', name: 'Kalorien', unit: 'kcal', icon: '🔥' },
            { key: 'Protein', name: 'Protein', unit: 'g', icon: '💪' },
            { key: 'Kohlenhydrate', name: 'Kohlenhydrate', unit: 'g', icon: '🌾' },
            { key: 'Fett', name: 'Fett', unit: 'g', icon: '🥑' },
            { key: 'Kalzium', name: 'Kalzium', unit: 'mg', icon: '🦴' },
            { key: 'Vitamin B12', name: 'Vitamin B12', unit: 'µg', icon: '💊' },
            { key: 'Eisen', name: 'Eisen', unit: 'mg', icon: '🩸' },
            { key: 'Vitamin C', name: 'Vitamin C', unit: 'mg', icon: '🍊' },
            { key: 'Zink', name: 'Zink', unit: 'mg', icon: '⚡' }
        ];

        nutrients.forEach(nutrient => {
            const referenceValue = this.referenceIntake[nutrient.key] || 0;
            const currentValue = this.currentDailyIntake?.[nutrient.key] || 0;
            const percentage = referenceValue > 0 ? Math.min((currentValue / referenceValue) * 100, 100) : 0;

            const nutrientCard = document.createElement('div');
            nutrientCard.className = 'nutrient-card';

            const percentageColor = this.getPercentageColor(percentage);

            nutrientCard.innerHTML = `
                <div class="nutrient-header">
                    <div class="nutrient-name">${nutrient.icon} ${nutrient.name}</div>
                    <div class="nutrient-percentage" style="color: ${percentageColor}">
                        ${percentage.toFixed(1)}%
                    </div>
                </div>
                <div class="nutrient-progress">
                    <div class="nutrient-progress-bar" style="width: ${percentage}%; background: ${percentageColor}"></div>
                </div>
                <div class="nutrient-values">
                    <span>${currentValue.toFixed(1)} ${nutrient.unit}</span>
                    <span>${referenceValue.toFixed(1)} ${nutrient.unit}</span>
                </div>
            `;

            nutrientsGrid.appendChild(nutrientCard);
        });

        console.log('🥗 Nutrients view updated successfully');
    }

    getPercentageColor(percentage) {
        if (percentage < 50) return '#ef4444';
        if (percentage < 80) return '#f59e0b';
        if (percentage <= 100) return '#10b981';
        return '#6366f1';
    }

    // Method to refresh all UI components with current data
    refreshUI() {
        console.log('🔄 Refreshing all UI components...');

        // Update quick stats
        this.updateQuickStats();

        // Update nutrients view
        this.updateNutrientsView('percentage');

        // Update chart
        if (this.nutritionChart) {
            // Check which chart button is active
            const activeChartBtn = document.querySelector('.chart-btn.active');
            const chartType = activeChartBtn ? activeChartBtn.getAttribute('data-chart') : 'nutrients';
            this.updateChart(chartType);
        }

        console.log('✅ UI refresh completed');
    }

    // Modal Management
    openModal(modalId) {
        console.log(`📂 Öffne Modal: ${modalId}`);

        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay');

        if (modal && overlay) {
            overlay.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log(`✅ Modal ${modalId} geöffnet`);
        } else {
            console.error(`❌ Modal ${modalId} oder Overlay nicht gefunden`);
        }
    }

    closeModal(modal) {
        if (modal) {
            console.log('📂 Schließe Modal');
            modal.classList.remove('active');
            const overlay = document.getElementById('modal-overlay');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        console.log('📂 Schließe alle Modals');
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach((modal) => {
            this.closeModal(modal);
        });
    }

    // Settings Management
    async saveSettings() {
        const ageInput = document.getElementById('age');
        const weightInput = document.getElementById('weight');

        if (!ageInput || !weightInput) {
            console.error('❌ Age oder Weight Input nicht gefunden');
            return;
        }

        const settings = {
            age: parseInt(ageInput.value),
            weight: parseFloat(weightInput.value)
        };

        if (!settings.age || !settings.weight) {
            this.showToast('Bitte füllen Sie alle Felder aus', 'warning');
            return;
        }

        try {
            this.showLoading(true);

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                this.currentSettings = settings;
                await this.loadReferenceIntake();
                this.updateNutrientsView('percentage');
                this.closeModal(document.getElementById('settings-modal'));
                this.showToast('Einstellungen gespeichert', 'success');
                console.log('✅ Settings gespeichert');
            } else {
                throw new Error('Fehler beim Speichern');
            }
        } catch (error) {
            console.error('❌ Fehler beim Speichern der Settings:', error);
            this.showToast('Fehler beim Speichern der Einstellungen', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Daily Entry Management
    async saveDailyEntry() {
        const foodSelect = document.getElementById('food-select');
        const quantityInput = document.getElementById('quantity');

        if (!foodSelect || !quantityInput) {
            console.error('❌ Food Select oder Quantity Input nicht gefunden');
            return;
        }

        const entry = {
            food_name: foodSelect.value,
            quantity: parseFloat(quantityInput.value)
        };

        if (!entry.food_name || !entry.quantity) {
            this.showToast('Bitte füllen Sie alle Felder aus', 'warning');
            return;
        }

        try {
            this.showLoading(true);

            const response = await fetch('/api/daily-intake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
            });            if (response.ok) {
                // Reload daily intake data
                await this.loadDailyIntake();

                // Reload daily entry count
                await this.loadDailyEntryCount();

                // Refresh all UI components
                this.refreshUI();

                this.closeModal(document.getElementById('daily-entry-modal'));
                this.showToast('Eintrag hinzugefügt', 'success');
                console.log('✅ Daily Entry gespeichert und UI aktualisiert');

                // Reset form
                foodSelect.value = '';
                quantityInput.value = '';
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Fehler beim Speichern');
            }
        } catch (error) {
            console.error('❌ Fehler beim Speichern des Daily Entry:', error);
            this.showToast('Fehler beim Speichern des Eintrags', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // FDC Food Management
    async saveFdcFood() {
        const fdcInput = document.getElementById('fdc-id');

        if (!fdcInput) return;

        const fdcId = fdcInput.value.trim();
        if (!fdcId) {
            this.showToast('Bitte geben Sie eine FDC ID ein', 'warning');
            return;
        }

        try {
            this.showLoading(true);

            const response = await fetch('/api/nutrient-database/fdc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fdc_id: fdcId })
            });

            const result = await response.json();

            if (response.ok && result.message) {
                this.closeModal(document.getElementById('fdc-modal'));
                this.showToast(result.message, 'success');
                fdcInput.value = '';
                console.log('✅ FDC Food gespeichert');
            } else {
                throw new Error(result.error || 'Fehler beim Importieren');
            }
        } catch (error) {
            console.error('❌ Fehler beim Speichern des FDC Foods:', error);
            this.showToast('Fehler beim Importieren des Lebensmittels', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Manual Food Management
    async saveManualFood() {
        const form = document.getElementById('manual-food-form');
        if (!form) return;

        const formData = new FormData(form);
        const foodData = {};

        for (const [key, value] of formData.entries()) {
            foodData[key] = value;
        }

        if (!foodData.Name) {
            this.showToast('Bitte geben Sie einen Namen ein', 'warning');
            return;
        }

        try {
            this.showLoading(true);

            const response = await fetch('/api/nutrient-database/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(foodData)
            });

            const result = await response.json();

            if (response.ok && result.message) {
                this.closeModal(document.getElementById('manual-food-modal'));
                this.showToast(result.message, 'success');
                form.reset();
                console.log('✅ Manual Food gespeichert');
            } else {
                throw new Error(result.error || 'Fehler beim Speichern');
            }
        } catch (error) {
            console.error('❌ Fehler beim Speichern des Manual Foods:', error);
            this.showToast('Fehler beim Speichern des Lebensmittels', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('nutritrack-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        console.log(`🎨 Theme eingerichtet: ${savedTheme}`);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('nutritrack-theme', newTheme);
        this.updateThemeIcon(newTheme);
        console.log(`🎨 Theme gewechselt zu: ${newTheme}`);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    // UI Helpers
    showLoading(show) {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.toggle('active', show);
        }
    }

    showToast(message, type = 'info') {
        console.log(`🍞 Toast: ${message} (${type})`);

        const container = document.getElementById('toast-container');
        if (!container) {
            console.error('❌ Toast Container nicht gefunden');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);

        // Remove on click
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }

    getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM geladen, initialisiere App...');

    try {
        new NutriTrackApp();
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren:', error);
    }
});

console.log('🎉 NutriTrack JavaScript Datei vollständig geladen');

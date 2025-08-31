let dailyCalories = 2000;
        let dailyProtein = 150;
        let dailyCarbs = 200;
        let dailyFat = 67;
        let foodLog = [];
        let consumedNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };

        // Scroll to section function
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }

        // Generate diet plan function
        function generatePlan() {
            const age = parseFloat(document.getElementById('age').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const activity = document.getElementById('activity').value;
            const goal = document.getElementById('goal').value;
            const dietType = document.getElementById('diet-type').value;

            // Validation
            if (!age || !weight || !height || age < 13 || age > 100 || weight < 30 || weight > 300 || height < 100 || height > 250) {
                alert('Please fill in all fields with valid values.');
                return;
            }

            // Calculate BMI
            const bmi = weight / Math.pow(height / 100, 2);
            let bmiStatus = '';
            if (bmi < 18.5) bmiStatus = 'Underweight';
            else if (bmi < 25) bmiStatus = 'Normal';
            else if (bmi < 30) bmiStatus = 'Overweight';
            else bmiStatus = 'Obese';

            // Calculate BMR (Mifflin-St Jeor Equation - assuming male for simplicity)
            let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

            // Activity multiplier
            let activityMultiplier = 1.2;
            switch (activity) {
                case 'light': activityMultiplier = 1.375; break;
                case 'moderate': activityMultiplier = 1.55; break;
                case 'active': activityMultiplier = 1.725; break;
            }

            // Calculate TDEE
            let tdee = bmr * activityMultiplier;

            // Adjust for goal
            if (goal === 'lose') tdee -= 500;
            else if (goal === 'gain') tdee += 500;

            dailyCalories = Math.round(tdee);

            // Calculate macros based on diet type
            let proteinPercent = 0.25, carbPercent = 0.45, fatPercent = 0.30;
            
            switch (dietType) {
                case 'high-protein':
                    proteinPercent = 0.35; carbPercent = 0.35; fatPercent = 0.30;
                    break;
                case 'low-carb':
                    proteinPercent = 0.30; carbPercent = 0.20; fatPercent = 0.50;
                    break;
                case 'keto':
                    proteinPercent = 0.25; carbPercent = 0.05; fatPercent = 0.70;
                    break;
            }

            dailyProtein = Math.round((dailyCalories * proteinPercent) / 4);
            dailyCarbs = Math.round((dailyCalories * carbPercent) / 4);
            dailyFat = Math.round((dailyCalories * fatPercent) / 9);

            // Update display
            document.getElementById('bmi-value').textContent = bmi.toFixed(1);
            document.getElementById('bmi-status').textContent = bmiStatus;
            document.getElementById('calories-value').textContent = dailyCalories;
            document.getElementById('protein-grams').textContent = dailyProtein + ' g';
            document.getElementById('carbs-grams').textContent = dailyCarbs + ' g';
            document.getElementById('fat-grams').textContent = dailyFat + ' g';
            
            const goalText = goal === 'lose' ? 'Lose Weight' : goal === 'maintain' ? 'Maintain Weight' : 'Gain Weight';
            document.getElementById('goal-display').textContent = goalText;

            // Show generated plan
            document.getElementById('generated-plan').classList.remove('hidden');
            updateNutritionProgress();
            saveState();
        }

        // Generate mock recipe data
        function generateMockRecipes(searchTerm) {
            const images = [
                'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&q=80',
                // 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80',
                // 'https://images.unsplash.com/photo-1512058564366-c9e3d5dcb8f4?w=800&q=80',
                'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'
            ];

            const base = [
                { label: `${capitalize(searchTerm)} Power Bowl`, calories: 420, protein: 28, carbs: 45, fat: 12 },
                { label: `${capitalize(searchTerm)} Salad`, calories: 320, protein: 12, carbs: 30, fat: 18 },
                { label: `Grilled ${capitalize(searchTerm)} with Veggies`, calories: 480, protein: 38, carbs: 35, fat: 20 },
                { label: `${capitalize(searchTerm)} Stir Fry`, calories: 390, protein: 24, carbs: 50, fat: 10 },
                { label: `${capitalize(searchTerm)} Wrap`, calories: 350, protein: 20, carbs: 40, fat: 11 },
                { label: `${capitalize(searchTerm)} Bowl - Low Carb`, calories: 300, protein: 30, carbs: 10, fat: 18 }
            ];

            return base.map((r, i) => ({
                label: r.label,
                image: images[i % images.length],
                source: 'NutriPlan Demo',
                url: '#',
                calories: r.calories,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat,
                ingredients: [
                    `${Math.max(50, 100 - i*5)}g ${searchTerm}`,
                    '1 tbsp olive oil',
                    'Mixed greens',
                    'Salt & pepper'
                ]
            }));
        }

        function capitalize(s) {
            if (!s) return s;
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        // Display recipes in the UI
        function displayRecipes(recipes) {
            const container = document.getElementById('recipe-results');
            container.innerHTML = '';

            if (!recipes || recipes.length === 0) {
                container.innerHTML = '<p class="text-center text-gray-300 col-span-full">No recipes found.</p>';
                return;
            }

            recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.className = 'meal-card rounded-xl p-0 overflow-hidden card-hover';

                card.innerHTML = `
                    <div class="relative">
                        <img src="${recipe.image}" alt="${escapeHtml(recipe.label)}" class="w-full h-44 object-cover">
                        <div class="absolute left-4 bottom-4 bg-white/10 backdrop-blur-sm py-2 px-3 rounded-full text-white text-sm font-medium">
                            ${recipe.source}
                        </div>
                    </div>
                    <div class="p-4">
                        <h4 class="text-white font-semibold text-lg mb-2">${escapeHtml(recipe.label)}</h4>
                        <p class="text-gray-300 text-sm mb-3">Approx: ${recipe.calories} kcal • ${recipe.protein}g P • ${recipe.carbs}g C • ${recipe.fat}g F</p>
                        <div class="flex gap-2">
                            <button class="add-to-log-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">Add to Log</button>
                            <a href="${recipe.url}" target="_blank" class="flex-1 text-center underline text-sm text-white/90 py-2 rounded-lg border border-white/10">View</a>
                        </div>
                    </div>
                `;

                // Add event to 'Add to Log' that inserts recipe's nutrition to food log
                card.querySelector('.add-to-log-btn').addEventListener('click', () => {
                    addFoodItem({
                        name: recipe.label,
                        calories: recipe.calories,
                        protein: recipe.protein,
                        carbs: recipe.carbs,
                        fat: recipe.fat,
                        quantity: 1,
                        timestamp: Date.now()
                    });
                });

                container.appendChild(card);
            });
        }

        // Simple HTML escape
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        // Quick search helper
        function quickRecipeSearch(term) {
            document.getElementById('recipe-search').value = term;
            searchRecipes(term);
        }

        // Mock food database (name: nutrition per 100g)
        const mockFoodDB = {
            'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
            'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
            'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
            'rice': { calories: 130, protein: 2.4, carbs: 28, fat: 0.3 },
            'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
            'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50 }
        };

        // Search for food (mock). In production, call a food nutrition API.
        function searchFood() {
            const query = document.getElementById('food-search').value.trim().toLowerCase();
            const qty = parseFloat(document.getElementById('food-quantity').value) || 100;

            if (!query) {
                alert('Please enter a food name to add.');
                return;
            }

            // If food exists in mock DB, add scaled nutrition, otherwise create approximate entry
            let entry;
            if (mockFoodDB[query]) {
                const per100 = mockFoodDB[query];
                const factor = qty / 100.0;
                entry = {
                    name: capitalize(query),
                    calories: Math.round(per100.calories * factor),
                    protein: roundTo(per100.protein * factor, 1),
                    carbs: roundTo(per100.carbs * factor, 1),
                    fat: roundTo(per100.fat * factor, 1),
                    quantity: qty,
                    timestamp: Date.now()
                };
            } else {
                // Approximate - assume 150 kcal per 100g
                const factor = qty / 100.0;
                entry = {
                    name: capitalize(query),
                    calories: Math.round(150 * factor),
                    protein: roundTo(5 * factor, 1),
                    carbs: roundTo(20 * factor, 1),
                    fat: roundTo(7 * factor, 1),
                    quantity: qty,
                    timestamp: Date.now()
                };
            }

            addFoodItem(entry);

            // Clear inputs for convenience
            document.getElementById('food-search').value = '';
            document.getElementById('food-quantity').value = '';
        }

        function roundTo(num, dec) {
            const mult = Math.pow(10, dec);
            return Math.round(num * mult) / mult;
        }

        // Add food item to log and update UI & storage
        function addFoodItem(item) {
            foodLog.push(item);
            // Update consumedNutrition totals
            consumedNutrition.calories += Number(item.calories);
            consumedNutrition.protein += Number(item.protein);
            consumedNutrition.carbs += Number(item.carbs);
            consumedNutrition.fat += Number(item.fat);

            saveState();
            renderFoodLog();
            updateNutritionProgress();

            // Visual feedback
            document.getElementById('consumed-calories').classList.add('animate-pulse-slow');
            setTimeout(() => {
                document.getElementById('consumed-calories').classList.remove('animate-pulse-slow');
            }, 800);
        }

        // Render the food log UI
        function renderFoodLog() {
            const logEl = document.getElementById('food-log');
            logEl.innerHTML = '';

            if (foodLog.length === 0) {
                logEl.innerHTML = '<p class="text-gray-400 text-center py-8">No food items logged yet. Start by adding some food above!</p>';
                return;
            }

            foodLog.slice().reverse().forEach((f, idx) => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between bg-white/5 p-3 rounded-lg';
                item.innerHTML = `
                    <div>
                        <div class="text-white font-medium">${escapeHtml(f.name)}</div>
                        <div class="text-gray-300 text-sm">${f.quantity ? f.quantity + 'g' : ''} • ${f.calories} kcal • ${f.protein}g P</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="text-sm text-gray-300 remove-btn">Remove</button>
                    </div>
                `;

                item.querySelector('.remove-btn').addEventListener('click', () => {
                    // find the real index in foodLog (reverse index mapping)
                    const realIndex = foodLog.length - 1 - idx;
                    removeFoodItem(realIndex);
                });

                logEl.appendChild(item);
            });
        }

        function removeFoodItem(index) {
            if (index < 0 || index >= foodLog.length) return;
            const f = foodLog.splice(index, 1)[0];

            // Subtract nutrition
            consumedNutrition.calories = Math.max(0, consumedNutrition.calories - Number(f.calories));
            consumedNutrition.protein = Math.max(0, consumedNutrition.protein - Number(f.protein));
            consumedNutrition.carbs = Math.max(0, consumedNutrition.carbs - Number(f.carbs));
            consumedNutrition.fat = Math.max(0, consumedNutrition.fat - Number(f.fat));

            saveState();
            renderFoodLog();
            updateNutritionProgress();
        }

        // Clear entire food log
        function clearFoodLog() {
            if (!confirm('Clear the entire food log?')) return;
            foodLog = [];
            consumedNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            saveState();
            renderFoodLog();
            updateNutritionProgress();
        }

        // Update nutrition tracker UI
        function updateNutritionProgress() {
            // Ensure daily goals are set
            const calGoal = dailyCalories || 2000;
            const proteinGoal = dailyProtein || 150;
            const carbsGoal = dailyCarbs || 200;
            const fatGoal = dailyFat || 67;

            // Update numeric displays
            document.getElementById('consumed-calories').textContent = consumedNutrition.calories;
            document.getElementById('consumed-protein').textContent = `${Math.round(consumedNutrition.protein)}g`;
            document.getElementById('consumed-carbs').textContent = `${Math.round(consumedNutrition.carbs)}g`;
            document.getElementById('consumed-fat').textContent = `${Math.round(consumedNutrition.fat)}g`;

            // Update calorie progress bar
            const calPercent = Math.min(100, Math.round((consumedNutrition.calories / calGoal) * 100));
            document.getElementById('calorie-progress').textContent = `${consumedNutrition.calories} / ${calGoal} kcal`;
            document.getElementById('calorie-progress-bar').style.width = `${calPercent}%`;

            // Update macro bars under generated plan if visible
            const proteinEl = document.getElementById('protein-bar');
            const carbsEl = document.getElementById('carbs-bar');
            const fatEl = document.getElementById('fat-bar');

            if (proteinEl && carbsEl && fatEl) {
                // compute percentages relative to macronutrient targets
                const pPerc = proteinGoal ? Math.min(100, Math.round((consumedNutrition.protein / proteinGoal) * 100)) : 0;
                const cPerc = carbsGoal ? Math.min(100, Math.round((consumedNutrition.carbs / carbsGoal) * 100)) : 0;
                const fPerc = fatGoal ? Math.min(100, Math.round((consumedNutrition.fat / fatGoal) * 100)) : 0;

                // Animate widths
                proteinEl.style.width = `${Math.min(100, pPerc)}%`;
                carbsEl.style.width = `${Math.min(100, cPerc)}%`;
                fatEl.style.width = `${Math.min(100, fPerc)}%`;
            }
        }

        // Save to memory (instead of localStorage to avoid browser storage issues in Claude)
        function saveState() {
            // In a real application, this would save to localStorage
            // For Claude artifact compatibility, we'll keep data in memory only
            console.log('State saved to memory');
        }

        // Load from memory (instead of localStorage)
        function loadState() {
            // In a real application, this would load from localStorage
            // For Claude artifact compatibility, we'll start with default values
            console.log('State loaded from memory');
        }

        // Simple searchRecipes wrapper to show loading and results using mock data
        async function searchRecipesWrapper(q) {
            document.getElementById('recipe-loading').classList.remove('hidden');
            document.getElementById('recipe-results').innerHTML = '';
            try {
                // Simulate network latency for nice UX
                await new Promise(r => setTimeout(r, 600));
                const recipes = generateMockRecipes(q);
                displayRecipes(recipes);
            } finally {
                document.getElementById('recipe-loading').classList.add('hidden');
            }
        }

        // Search recipes function
        async function searchRecipes(query = null) {
            const searchTerm = query || document.getElementById('recipe-search').value.trim();
            if (!searchTerm) {
                alert('Please enter a search term');
                return;
            }
            await searchRecipesWrapper(searchTerm);
        }

        // Initialize on load
        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            loadState();
            renderFoodLog();
            updateNutritionProgress();

            // If the user has previously generated goals, display them
            const planEl = document.getElementById('generated-plan');
            if (dailyCalories && dailyCalories !== 2000) {
                document.getElementById('calories-value').textContent = dailyCalories;
                document.getElementById('protein-grams').textContent = `${dailyProtein} g`;
                document.getElementById('carbs-grams').textContent = `${dailyCarbs} g`;
                document.getElementById('fat-grams').textContent = `${dailyFat} g`;
                planEl.classList.remove('hidden');
            }

            // Wire mobile menu
            const mobileBtn = document.getElementById('mobile-menu-btn');
            if (mobileBtn) {
                mobileBtn.addEventListener('click', () => {
                    document.getElementById('mobile-menu').classList.toggle('hidden');
                });
            }

            // Add enter key support for search inputs
            document.getElementById('recipe-search').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchRecipes();
                }
            });

            document.getElementById('food-search').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchFood();
                }
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add loading animation to form submission
            const formInputs = document.querySelectorAll('#age, #weight, #height');
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Remove any error styling
                    this.classList.remove('border-red-400');
                });
            });

            // Initialize progress bars animation
            setTimeout(() => {
                updateNutritionProgress();
            }, 100);
        });

        // Utility function for smooth animations
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                element.textContent = current;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Add visual feedback for button clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('no-feedback')) {
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });

        // Form validation helper
        function validateInput(element, min, max, fieldName) {
            const value = parseFloat(element.value);
            if (!value || value < min || value > max) {
                element.classList.add('border-red-400');
                element.classList.remove('border-white/20');
                return false;
            } else {
                element.classList.remove('border-red-400');
                element.classList.add('border-green-400');
                return true;
            }
        }

        // Enhanced search with debouncing
        let searchTimeout;
        function debounceSearch(searchFunction, delay = 300) {
            return function(...args) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => searchFunction.apply(this, args), delay);
            };
        }

        // Add nutritional insights
        function getNutritionalInsight(consumedCalories, goalCalories) {
            const percentage = (consumedCalories / goalCalories) * 100;
            
            if (percentage < 70) {
                return { message: "You're below your calorie goal. Consider adding a healthy snack.", color: "text-yellow-400" };
            } else if (percentage > 110) {
                return { message: "You've exceeded your calorie goal. Great job staying active!", color: "text-red-400" };
            } else {
                return { message: "Perfect! You're on track with your calorie goal.", color: "text-green-400" };
            }
        }

        // Console welcome message
        console.log(`
        🌿 Welcome to NutriPlan! 🌿
        
        This is a demo nutrition planning application.
        Features include:
        • Personal diet plan generation
        • Recipe discovery with mock data
        • Nutrition tracking and logging
        • BMI calculation and macro distribution
        
        For a production version, integrate with real APIs like:
        - Edamam Recipe API
        - Spoonacular API
        - USDA Food Data Central
        
        Built with modern web technologies and responsive design.
        `);
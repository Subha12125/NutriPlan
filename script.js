const { update } = require("three/examples/jsm/libs/tween.module.js");

const mobileBtn = document.getElementById("mobile-menu-btn");
if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
        document.getElementById("mobile-menu").classList.toggle("hidden");
    });
}

// Some Global Varibales
let dailyCalories = 2000;
let dailyProtein = 150;
let dailyCarbs = 200;
let dailyFat = 67;
let foodLog = [];
let consumedNutrition = { calories: 0, protine: 0, carbs: 0, fat: 0 };

// scroll section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

// Generated Diet plan function
function generatePlan() {
    const age = parseFloat(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const activity = parseFloat(document.getElementById("activity").value);
    const goal = parseFloat(document.getElementById("goal").value);
    const dietType = parseFloat(document.getElementById("diet-type").value);

    // validation
    if (
        !age ||
        !weight ||
        !height ||
        age < 13 ||
        age > 100 ||
        weight > 300 ||
        height < 100 ||
        height > 250
    ) {
        alert("Please fill all the fields with valid values.");
        return;
    }
    // Calculate BMI
    const bmi = weight / Math.pow(height / 100, 2);
    let bmiStatus = "";
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 25) bmiStatus = "Normal";
    else if (bmi < 30) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
    // calculate BMR
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    //Activity Multiplier

    let activityMultiplier = 1.2;
    switch (activity) {
        case "light":
            activityMultiplier = 1.375;
            break;
        case "moderate":
            activityMultiplier = 1.55;
            break;
        case "intense":
            activityMultiplier = 1.725;
            break;
    }

    // Calculate TDEE
    let tdee = bmr * activityMultiplier;

    //Adjust for goal
    if (goal === "lose") tdee -= 500;
    else if (goal === "gain") tdee += 500;

    let proteinPercent = 0.25,
        carbPercent = 0.45,
        fatPercent = 0.3;

    dailyCalories = Math.round(tdee);
    dailyProtein = Math.round((dailyCalories * proteinPercent) / 4);
    dailyCarbs = Math.round((dailyCalories * carbPercent) / 4);
    dailyFat = Math.round((dailyCalories * fatPercent) / 9);

    //Update display
    document.getElementById("bmi-value").textContent = bmi.toFixed(1);
    document.getElementById("bmi-status").textContent = bmiStatus;
    document.getElementById("calories-value").textContent = dailyCalories;
    document.getElementById("protein-grams").textContent = dailyProtein + " g";
    document.getElementById("carbs-grams").textContent = dailyCarbs + " g";
    document.getElementById("fat-grams").textContent = dailyFat + " g";

    const goalText =
        goal === "lose"
            ? "Lose Weight"
            : goal === "maintain"
                ? "Maintain Weight"
                : "Gain Weight";
    document.getElementById("goal-text").textContent = goalText;

    //show generated plan
    document.getElementById("generated-plan").classList.remove("hidden");
    updateNutritionProgress();
    saveState();
}

function generateMockRecipes(searchTerm) {
    const images = [
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&q=80",
        "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80",
        "https://images.unsplash.com/photo-1512058564366-c9e3d5dcb8f4?w=800&q=80",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    ];

    const base = [
        {
            label: `${capitalize(searchTerm)} Power Bowl`,
            calories: 420,
            protein: 28,
            carbs: 45,
            fat: 12,
        },
        {
            label: `${capitalize(searchTerm)} Salad`,
            calories: 320,
            protein: 12,
            carbs: 30,
            fat: 18,
        },
        {
            label: `Grilled ${capitalize(searchTerm)} with Veggies`,
            calories: 480,
            protein: 38,
            carbs: 35,
            fat: 20,
        },
        {
            label: `${capitalize(searchTerm)} Stir Fry`,
            calories: 390,
            protein: 24,
            carbs: 50,
            fat: 10,
        },
        {
            label: `${capitalize(searchTerm)} Wrap`,
            calories: 350,
            protein: 20,
            carbs: 40,
            fat: 11,
        },
        {
            label: `${capitalize(searchTerm)} Bowl - Low Carb`,
            calories: 300,
            protein: 30,
            carbs: 10,
            fat: 18,
        },
    ];
    return base.map((r, i) => ({
        label: r.label,
        image: images[i % images.length],
        source: "NutriPlan Demo",
        url: "#",
        calories: r.calories,
        protein: r.protein,
        carbs: r.carbs,
        fat: r.fat,
        ingredients: [
            `${Math.max(50, 100 - i * 5)}g ${searchTerm}`,
            "1 tbsp olive oil",
            "Mixed greens",
            "Salt & pepper",
        ],
    }));
}

function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Display recipies in the UI
function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        container.innerHTML =
            '<p class="text-center text-gray-300 col-span-full">No recipes found.</p>';
        return;
    }

    recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "meal-card rounded-xl p-0 overflow-hidden card-hover";

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
    });
}

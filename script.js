const mobileBtn = document.getElementById('mobile-menu-btn');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
}


// Some Global Varibales 
let dailyCalories = 2000;
let dailyProtein = 150;
let dailyCarbs = 200;
let dailyFat = 67;
let foodLog = [];
let consumedNutrition = { calories:0 , protine :0, carbs:0, fat:0};

// scroll section
function scrollToSection(sectionId){
    document.getElementById(sectionId).scrollIntoView({ behavior : 'smooth'});
}

// Generated Diet plan function
function generatePlan(){
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = parseFloat(document.getElementById('goal').value);
    const dietType = parseFloat(document.getElementById('diet-type').value);


    // validation
    if(!age || !weight || !height || age < 13 || age > 100 || weight > 300 || height < 100 || height > 250){
        alert("Please fill all the fields with valid values.");
        return;
    }

    const bmi = weight / Math.pow(height/100,2);
    let bmiStatus = '';
    if(bmi < 18.5) bmiStatus = 'Underweight';
    else if (bmi < 25) bmiStatus = 'Normal';
    else if (bmi < 30) bmiStatus = 'Overweight';
    else bmiStatus = 'Obese';
}



// Calorie Intake Estimator
// This script calculates an estimated daily calorie intake based on user input



const form = document.getElementById("calorie-form");



// Input Values

function getInputs() {
    const age = Number(document.getElementById("age").value);
    const weight = Number(document.getElementById("weight").value);
    const feet = Number(document.getElementById("height-feet").value);
    const inches = Number(document.getElementById("height-inches").value);

    const gender = document.getElementById("gender").value;
    const activityLevel = document.getElementById("activity").value;
    const goal = document.getElementById("goal").value;

    return { age, weight, feet, inches, gender, activityLevel, goal };
}



// Input Validation

function validateInputs(data) {
    const { age, weight, feet, inches, gender, activityLevel, goal } = data;

    if (
        !age &&
        age !== 0 ||
        !weight &&
        weight !== 0 ||
        !feet &&
        feet !== 0 ||
        !inches &&
        inches !== 0 ||
        !gender ||
        !activityLevel ||
        !goal
    ) {
        document.getElementById("bmr-result").textContent = "-";
        document.getElementById("activity-result").textContent = "-";
        document.getElementById("tdee-result").textContent = "-";
        document.getElementById("final-result").textContent = "-";
        return false;
    }

    return true;
}



// Unit Conversions

function convertUnits(weight, feet, inches) {
    const heightInInches = (feet * 12) + inches;
    const heightInCm = heightInInches * 2.54;
    const weightInKg = weight * 0.453592;

    return { heightInCm, weightInKg };
}



// Activity Level Multipliers

function getMultiplier(activityLevel) {
    const activityMultipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very-active": 1.9
    };

    return activityMultipliers[activityLevel];
}



// BMR Calculation

function calculateBMR(gender, weightInKg, heightInCm, age) {
    if (gender === "male") {
        return 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
        return 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }
}



// TDEE Calculation

function calculateTDEE(bmr, multiplier) {
    return bmr * multiplier;
}



// Goal Adjustments

function applyGoal(tdee, goal) {
    let finalCalories = tdee;

    if (goal === "lose-weight") {
        finalCalories -= 500;
    } else if (goal === "gain-weight") {
        finalCalories += 300;
    }

    return finalCalories;
}



// Display Results

function displayResults(bmr, multiplier, tdee, finalCalories) {
    document.getElementById("bmr-result").textContent =
        `${Math.round(bmr)} kcal`;

    document.getElementById("activity-result").textContent =
        `${multiplier}x Activity`;

    document.getElementById("tdee-result").textContent =
        `${Math.round(tdee)} kcal`;

    document.getElementById("final-result").textContent =
        `${Math.round(finalCalories)} kcal`;
}



// Main Calculation Function

function calculateCalories() {

    const data = getInputs();

    if (!validateInputs(data)) return;

    const { age, weight, feet, inches, gender, activityLevel, goal } = data;

    const { heightInCm, weightInKg } = convertUnits(weight, feet, inches);

    const multiplier = getMultiplier(activityLevel);

    const bmr = calculateBMR(gender, weightInKg, heightInCm, age);

    const tdee = calculateTDEE(bmr, multiplier);

    const finalCalories = applyGoal(tdee, goal);

    displayResults(bmr, multiplier, tdee, finalCalories);

    // Return data for history

    return {
    age,
    weight,
    feet,
    inches,
    activityLevel,
    goal,
    finalCalories
}};



// Form Submission Handler

form.addEventListener("submit", function(event) {
    event.preventDefault();
    userHasStarted = true;

    const result = calculateCalories();


    if (result) {
        saveHistory(result);
    }
    
});



// Theme Toggle Functionality

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
});

// Save History Functionality (localStorage)

function saveHistory(data) {
    let history = JSON.parse(localStorage.getItem("calorieHistory")) || [];
    
    const entry = {
        date: new Date().toLocaleString(),
        age: data.age,
        weight: data.weight,
        heightFeet: data.feet,
        heightInches: data.inches,
        height: `${data.feet}'${data.inches}"`,
        activityLevel: data.activityLevel,
        goal: data.goal,
        finalCalories: Math.round(data.finalCalories)
    };

    history.push(entry);

    // Keep only last 10 entries

    history = history.slice(0, 10);

    localStorage.setItem("calorieHistory", JSON.stringify(history));

}

// Load History

function loadHistory() {
    return JSON.parse(localStorage.getItem("calorieHistory")) || [];
    }
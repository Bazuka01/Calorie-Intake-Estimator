// Calorie Intake Estimator
// This script calculates an estimated daily calorie intake based on user input

let userHasStarted = false;

const form = document.getElementById("calorie-form");

// Main Calculation Function

function calculateCalories() {

    // Prevent early calculation before user interacts
    if (!userHasStarted) return;

    // Retrieve and Validate User Inputs

    const age = Number(document.getElementById("age").value);
    const weight = Number(document.getElementById("weight").value);
    const feet = Number(document.getElementById("height-feet").value);
    const inches = Number(document.getElementById("height-inches").value);

    const gender = document.getElementById("gender").value;
    const activityLevel = document.getElementById("activity").value;
    const goal = document.getElementById("goal").value;

    // Input Validation - Ensure all fields are filled

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
        return;
    }

    // Unit Conversions

    const heightInInches = (feet * 12) + inches;
    const heightInCm = heightInInches * 2.54;
    const weightInKg = weight * 0.453592;

    // Activity Level Multipliers

    const activityMultipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very-active": 1.9
    };

    const multiplier = activityMultipliers[activityLevel];

    // Basal Metabolic Rate (BMR) Calculation using Mifflin-St Jeor Equation

    let bmr;

    if (gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    // Total Daily Energy Expenditure (TDEE) Calculation

    let tdee = bmr * multiplier;

    // Goal Adjustments

    let finalCalories = tdee;

    if (goal === "lose-weight") {
        finalCalories -= 500;
    } else if (goal === "gain-weight") {
        finalCalories += 300;
    }

    // Display Results

    document.getElementById("bmr-result").textContent =
        `${Math.round(bmr)} kcal`;

    document.getElementById("activity-result").textContent =
        `${multiplier}x Activity`;

    document.getElementById("tdee-result").textContent =
        `${Math.round(tdee)} kcal`;

    document.getElementById("final-result").textContent =
        `${Math.round(finalCalories)} kcal`;

    // Debugging Logs

    console.log(age);

    console.log(
        `Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`
    );

    console.log("Weight: " + weightInKg + " kg");

    console.log("Height: " + heightInCm + " cm");

    console.log(`Activity Level: ${activityLevel}`);

    console.log(`Goal: ${goal}`);

    console.log("BMR:", bmr);

    console.log("TDEE:", tdee);

    console.log("Final:", finalCalories);
}

// Form Submission Handler

form.addEventListener("submit", function(event) {
    event.preventDefault();
    userHasStarted = true;
    calculateCalories();
});

// Live Update on Input Change

const inputs = form.querySelectorAll("input, select");

inputs.forEach(input => {
    input.addEventListener("input", () => {
        userHasStarted = true;
        calculateCalories();
    });
});

// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
});
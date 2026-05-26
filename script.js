// Calorie Intake Estimator
// This script calculates an estimated daily calorie intake based on user input

const form = document.getElementById('calorie-form');

form.addEventListener("submit", function(event) {
    event.preventDefault();

const age = Number(document.getElementById("age").value);
const weight = Number(document.getElementById("weight").value);
const feet = Number(document.getElementById("height-feet").value);
const inches = Number(document.getElementById("height-inches").value);
const gender = document.getElementById("gender").value;
const activityLevel = document.getElementById("activity").value;
const goal = document.getElementById("goal").value;

const heightInInches = (feet * 12) + inches;
const heightInCm = heightInInches * 2.54;
const weightInKg = weight * 0.453592;


const activityMultipliers = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very-active": 1.9
};

const multiplier = activityMultipliers[activityLevel];

// Base Metabolic Rate (BMR) Calculation

let bmr;
if (gender === "male") {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
} else {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
}

// Total Daily Energy Expenditure (TDEE) Calculation

let tdee = bmr * multiplier;

// Adjusting TDEE Based on Goal

let finalCalories = tdee;

if (goal === "lose-weight") {
    finalCalories -= 500;
}
else if (goal === "gain-weight") {
    finalCalories += 300;
}

// Displaying Results

document.getElementById("bmr-result").textContent =
    `BMR: ${Math.round(bmr)} kcal`;

document.getElementById("activity-result").textContent =
    `Activity Multiplier: ${multiplier}`;

document.getElementById("tdee-result").textContent =
    `TDEE (maintenance): ${Math.round(tdee)} kcal`;

document.getElementById("final-result").textContent =
    `Final Calories (goal adjusted): ${Math.round(finalCalories)} kcal`;


console.log(age);
console.log(`Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`);
console.log('Weight: ' + weightInKg + ' kg');
console.log('Height: ' + heightInCm + ' cm');
console.log(`Activity Level: ${activityLevel}`);
console.log(`Goal: ${goal}`);
console.log("BMR:", bmr);
console.log("TDEE:", tdee);
console.log("Final:", finalCalories);


});

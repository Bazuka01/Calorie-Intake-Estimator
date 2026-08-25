// Nutrition Page
// This script handles nutrition recommendations and food searches


// API Configuration

const API_URL = "https://calorix-backend-h1ta.onrender.com/nutrition";



// Theme Toggle Functionality

const themeToggle = document.getElementById("theme-toggle");

// Load saved theme

if (localStorage.getItem("theme") === "light") {

    document.body.classList.add("light-mode");

    themeToggle.checked = true;

}

// Toggle theme

themeToggle.addEventListener("change", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

    } else {

        localStorage.setItem("theme", "dark");

    }

});


let currentNutritionResults = [];

let activeFilter = null;


// Load Latest Calorie Goal

function loadLatestGoal() {

    const history =
        JSON.parse(localStorage.getItem("calorieHistory")) || [];

    if (history.length === 0) {
        return null;
    }

    return history[0];

}



// Display Daily Calorie Goal

function displayGoal() {

    const latestEntry = loadLatestGoal();

    const goalElement =
        document.getElementById("daily-calories");

    if (!latestEntry) {

        goalElement.textContent =
            "No calculation found";

        return;

    }

    goalElement.textContent =
        `${latestEntry.finalCalories} kcal`;

}



// Get Food Search Input

function getFoodInput() {

    const search =
        document.getElementById("food-search")
        .value
        .trim();

    return search;

}



// Validate Food Input

function validateFood(search) {

    if (search === "") {

        alert("Please enter a food.");

        return false;

    }

    if (!/[a-zA-Z]/.test(search)) {

        alert("Please enter a valid food name.");

        return false;

    }

    return true;

}



// Get Nutrient Value

function getNutrientValue(nutrients, nutrientName) {

    const nutrient = nutrients.find(
        item => item.nutrientName === nutrientName
    );

    return nutrient ? nutrient.value : 0;

}



// Display Food Results

function displayFoodResults(results) {

    const foodResults =
        document.getElementById("food-results");

    foodResults.innerHTML = "";

    results.forEach(nutrition => {

        foodResults.innerHTML += `

            <div class="nutrition-card">

                <h3>${nutrition.name}</h3>

                <p class="serving-size">
                    Serving:
                    ${nutrition.servingSize || "N/A"}
                    ${nutrition.servingSizeUnit || ""}
                </p>

                <div class="nutrition-grid">

                    <div>
                        <span>Calories</span>
                        <strong>
                            ${Math.round(nutrition.calories)} kcal
                        </strong>
                    </div>

                    <div>
                        <span>Protein</span>
                        <strong>
                            ${nutrition.protein} g
                        </strong>
                    </div>

                    <div>
                        <span>Carbs</span>
                        <strong>
                            ${nutrition.carbs} g
                        </strong>
                    </div>

                    <div>
                        <span>Fat</span>
                        <strong>
                            ${nutrition.fat} g
                        </strong>
                    </div>

                    <div>
                        <span>Fiber</span>
                        <strong>
                            ${nutrition.fiber} g
                        </strong>
                    </div>

                </div>

            </div>

        `;

    });

}

// Sort Food Results

function sortByHighProtein() {

    if (activeFilter === "high-protein") {

        activeFilter = null;

        displayFoodResults(currentNutritionResults);

        return;
    }

    activeFilter = "high-protein";

    const sortedResults =
        [...currentNutritionResults].sort(
            (a, b) => b.protein - a.protein
        );

    displayFoodResults(sortedResults);
}


function sortByLowCarb() {

    if (activeFilter === "low-carb") {

        activeFilter = null;

        displayFoodResults(currentNutritionResults);

        return;
    }

    activeFilter = "low-carb";

    const sortedResults =
        [...currentNutritionResults].sort(
            (a, b) => a.carbs - b.carbs
        );

    displayFoodResults(sortedResults);
}


function sortByLowFat() {

    if (activeFilter === "low-fat") {

        activeFilter = null;

        displayFoodResults(currentNutritionResults);

        return;
    }

    activeFilter = "low-fat";

    const sortedResults =
        [...currentNutritionResults].sort(
            (a, b) => a.fat - b.fat
        );

    displayFoodResults(sortedResults);
}

// Set Active Filter Button

function setActiveFilter(activeButton) {

    const filterButtons =
        document.querySelectorAll(".filter-buttons button");

    filterButtons.forEach(button => {
        button.classList.remove("active");
    });

    activeButton.classList.add("active");
}


// Search Food Functionality

function searchFood() {

    const food = getFoodInput();

    if (!validateFood(food)) {
        return;
    }

    fetchNutritionData(food);

}

// Show Loading Message

function showLoading() {

    const foodResults =
        document.getElementById("food-results");

    foodResults.innerHTML = `
        <p class="loading-message">
            Searching for nutrition information...
        </p>
    `;
}

// Show No Results Message

function showNoResults(food) {

    const foodResults =
        document.getElementById("food-results");

    foodResults.innerHTML = `
        <p class="no-results-message">
            No nutrition information found for "${food}".
        </p>
    `;
}

// Fetch Nutrition Data from API

async function fetchNutritionData(food) {

    try {

        activeFilter = null;

        document
            .querySelectorAll(".filter-buttons button")
            .forEach(button => {
                button.classList.remove("active");
            });

        showLoading();

        const response = await fetch(
            `${API_URL}?food=${encodeURIComponent(food)}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch nutrition data."
            );
        }

        const data = await response.json();


        if (!data.foods || data.foods.length === 0) {

            showNoResults(food);

            return;

        }

        const nutritionResults =
            data.foods.map(foodData => {

                const nutrients =
                    foodData.foodNutrients;

                return {

                    name: foodData.description,

                    calories: getNutrientValue(
                        nutrients,
                        "Energy"
                    ),

                    protein: getNutrientValue(
                        nutrients,
                        "Protein"
                    ),

                    carbs: getNutrientValue(
                        nutrients,
                        "Carbohydrate, by difference"
                    ),

                    fat: getNutrientValue(
                        nutrients,
                        "Total lipid (fat)"
                    ),

                    fiber: getNutrientValue(
                        nutrients,
                        "Fiber, total dietary"
                    ),

                    servingSize:
                        foodData.servingSize,

                    servingSizeUnit:
                        foodData.servingSizeUnit

                };

            });

        currentNutritionResults = nutritionResults;

        displayFoodResults(currentNutritionResults);

    } catch (error) {


        console.error(
            "Nutrition API error:",
            error
        );
        
        showError(
            "An error occurred while fetching nutrition data. Please try again later."
        );

    }

}

// Search Button Functionality

const searchButton =
    document.getElementById("search-button");

searchButton.addEventListener(
    "click",
    searchFood
);



// Generate Recommendations

function getRecommendations(goal) {

    if (goal === "lose-weight") {

        return {

            description:
                "Foods focused on high protein and lower calories",

            foods: [

                "Chicken Breast",
                "Salmon",
                "Greek Yogurt",
                "Egg Whites"

            ]

        };

    }

    else if (goal === "gain-weight") {

        return {

            description:
                "Foods focused on higher calories and nutrient density",

            foods: [

                "Rice",
                "Peanut Butter",
                "Avocado",
                "Salmon"

            ]

        };

    }

    else {

        return {

            description:
                "Balanced foods for maintaining your goals",

            foods: [

                "Chicken",
                "Eggs",
                "Oatmeal",
                "Broccoli"

            ]

        };

    }

}



// Display Recommendations

function displayRecommendations() {

    const latestEntry = loadLatestGoal();

    const recommendationList =
        document.getElementById("recommendation-list");

    const description =
        document.getElementById("recommendation-description");

    if (!latestEntry) {

        recommendationList.innerHTML =
            "<p>Complete a calculation to get recommendations.";

        return;

    }

    const recommendations =
        getRecommendations(latestEntry.goal);

    description.textContent =
        recommendations.description;

    recommendationList.innerHTML = "";

    recommendations.foods.forEach(food => {

        const card = document.createElement("div");

        card.classList.add(
            "food-card",
            "recommendation-food"
        );

        card.innerHTML = `
            <h3>${food}</h3>
            <p>View nutrition information →</p>
        `;

        card.addEventListener("click", () => {

            document.getElementById("food-search").value =
                food;

            fetchNutritionData(food);

            document.getElementById("food-results")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

        recommendationList.appendChild(card);

    });

}


// Show API Error Message

function showError(message) {

    const foodResults =
        document.getElementById("food-results");

    foodResults.innerHTML = `
        <p class="status-message error">
            ${message}
        </p>
    `;

}





// Load Page Data

displayGoal();

displayRecommendations();


// Event Listeners for Sorting

document
    .getElementById("high-protein-filter")
    .addEventListener("click", function () {

        sortByHighProtein();

        if (activeFilter === "high-protein") {
            setActiveFilter(this);
        } else {
            this.classList.remove("active");
        }

    });


document
    .getElementById("low-carb-filter")
    .addEventListener("click", function () {

        sortByLowCarb();

        if (activeFilter === "low-carb") {
            setActiveFilter(this);
        } else {
            this.classList.remove("active");
        }

    });


document
    .getElementById("low-fat-filter")
    .addEventListener("click", function () {

        sortByLowFat();

        if (activeFilter === "low-fat") {
            setActiveFilter(this);
        } else {
            this.classList.remove("active");
        }

    });

// Nutrition Page
// This script handles nutrition recommendations and food searches



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




// Load Latest Calorie Goal

function loadLatestGoal() {

    const history = JSON.parse(localStorage.getItem("calorieHistory")) || [];


    if (history.length === 0) {

        return null;

    }


    return history[0];

}




// Display Daily Calorie Goal

function displayGoal() {

    const latestEntry = loadLatestGoal();

    const goalElement = document.getElementById("daily-calories");


    if (!latestEntry) {

        goalElement.textContent = "No calculation found";

        return;

    }


    goalElement.textContent =
        `${latestEntry.finalCalories} kcal`;

}




// Get Food Search Input

function getFoodInput() {

    const search = document
        .getElementById("food-search")
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


    return true;

}




// Display Food Results

function displayFoodResults(food) {

    const foodResults = document.getElementById("food-results");


    foodResults.innerHTML = `

        <div class="food-card">

            <h3>${food}</h3>

            <p><strong>Calories:</strong> -- kcal</p>

            <p><strong>Protein:</strong> -- g</p>

            <p><strong>Carbs:</strong> -- g</p>

            <p><strong>Fat:</strong> -- g</p>

        </div>

    `;

}




// Search Food Functionality

function searchFood() {

    const food = getFoodInput();


    if (!validateFood(food)) {

        return;

    }


    fetchNutritionData(food);

}

// Fetch Nutrition Data Functionality

async function fetchNutritionData(food) {

    // API request will go here

    console.log("Searching API for:", food);

}



// Search Button Functionality

const searchButton = document.getElementById("search-button");


searchButton.addEventListener("click", searchFood);




// Load Page Data

displayGoal();

displayRecommendations();

// Load User Goal

function loadLatestGoal() {

    const history = JSON.parse(localStorage.getItem("calorieHistory")) || [];


    if (history.length === 0) {

        return null;

    }


    return history[0];

}



// Generate Recommendations

function getRecommendations(goal) {


    if (goal === "lose-weight") {

        return {

            description: "Foods focused on high protein and lower calories",

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

            description: "Foods focused on higher calories and nutrient density",

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

            description: "Balanced foods for maintaining your goals",

            foods: [

                "Chicken",
                "Eggs",
                "Oatmeal",
                "Vegetables"

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
            "<p>Complete a calculation to get recommendations.</p>";

        return;

    }



    const recommendations =
        getRecommendations(latestEntry.goal);



    description.textContent =
        recommendations.description;



    recommendationList.innerHTML = "";



    recommendations.foods.forEach(food => {


        recommendationList.innerHTML += `

            <div class="food-card">

                <h3>${food}</h3>

                <p>Nutrition data coming soon...</p>

            </div>

        `;


    });


}
// Load History Functionality

function loadHistory() {
    return JSON.parse(localStorage.getItem("calorieHistory")) || [];
}

// Display History Functionality

function displayHistory() {

    const history = loadHistory();

    const historyList = document.getElementById("history-list");

    if (history.length === 0) {
        historyList.innerHTML = "<p>No saved calculations yet.</p>";
        return;
    }

    historyList.innerHTML = "";

    history.forEach((entry, index) => {

        historyList.innerHTML += `
            <div class="history-card">
                <h3>${entry.date}</h3>

                <p><strong>Age:</strong> ${entry.age}</p>

                <p><strong>Weight:</strong> ${entry.weight} lbs</p>

                <p><strong>Height:</strong> ${entry.height}</p>

                <p><strong>Activity:</strong> ${entry.activityLevel}</p>

                <p><strong>Goal:</strong> ${entry.goal}</p>

                <p><strong>Calories:</strong> ${entry.finalCalories} kcal</p>

                <button onclick="deleteEntry(${index})">Delete</button>
            </div>
        `;
    });
}

// Clear History Functionality

function clearHistory() {

    if (!confirm("Are you sure you want to clear your history?")) {
        return;
    }

    localStorage.removeItem("calorieHistory");

    displayHistory();

}
// Load History When Page Opens

displayHistory();

const clearButton = document.getElementById("clear-history-btn");

clearButton.addEventListener("click", clearHistory);

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

// Delete Entry Functionality

function deleteEntry(index) {
    let history = loadHistory();

    history.splice(index, 1);

    localStorage.setItem("calorieHistory", JSON.stringify(history));

    displayHistory();
}


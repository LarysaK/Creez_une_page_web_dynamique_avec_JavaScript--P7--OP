// CONSTANTS
const BASE_URL = "http://localhost:5678/api/";
const WORKS_API = `${BASE_URL}works`;
const CATEGORY_API = `${BASE_URL}categories`;
const GALLERY_DIV = document.querySelector(".gallery");
const FILTER_DIV = document.querySelector(".filter");

// Display works in the gallery on page load
fetchAndDisplayWorks(GALLERY_DIV, false);

// Refresh works in the gallery
function refreshWorks(targetDiv, deleteButton) {
    targetDiv.innerHTML = '';
    fetchAndDisplayWorks(targetDiv, deleteButton);
}

// Fetch works from the server and display in the gallery
function fetchAndDisplayWorks(targetDiv, deleteButton) {
    fetchWorks(targetDiv, deleteButton);
}

// Fetch works from the server
function fetchWorks(targetDiv, deleteButton) {
    fetch(WORKS_API)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(works => {
            workList = works;
            for (let i = 0; i < works.length; i++) {
                createWork(works[i], targetDiv, deleteButton);
            }
        })
        .catch(error => console.error('Error fetching works:', error));
}

// Display a single work in the gallery
function createWork(work, targetDiv, deleteButton) {
    let figure = document.createElement("figure");
    let imgWorks = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    imgWorks.src = work.imageUrl;
    figcaption.innerHTML = work.title;
    figure.appendChild(imgWorks);
    figure.appendChild(figcaption);
    targetDiv.appendChild(figure);
    if (deleteButton) {
        createDeleteButton(figure, work);
    }
}

// Fetch categories from the server and create filter buttons
fetch(CATEGORY_API)
    .then(response => response.json())
    .then(categories => {
        let filterWorks = new Set(categories);
        let nouvelleCategorie = { id: 0, name: "Tous" };
        createFilterButton(nouvelleCategorie);
        addSelectedClass(nouvelleCategorie.id);
        for (let category of filterWorks) {
            createFilterButton(category);
        }
    });

// Create filter buttons
function createFilterButton(category) {
    let categoryLink = document.createElement("a");
    categoryLink.id = "category" + category.id;
    categoryLink.classList.add("category");
    categoryLink.innerHTML = category.name;
    FILTER_DIV.appendChild(categoryLink);

    categoryLink.addEventListener("click", function () {
        filterWorksByCategory(category.id);
    });
}

// Filter works based on selected category
function filterWorksByCategory(categoryId) {
    GALLERY_DIV.innerHTML = '';

    for (let i = 0; i < workList.length; i++) {
        if (workList[i].categoryId === categoryId || categoryId === 0) {
            createWork(workList[i], GALLERY_DIV, false);
        }
    }

    removeSelectedClass();
    addSelectedClass(categoryId);
}

// Modify login to logout if necessary
gestion_login();

// Create delete button for each image
function createDeleteButton(figure, work) {
    let button = document.createElement('i');
    button.classList.add("fa-regular", "fa-trash-can");
    button.addEventListener('click', DELETE_WORK);
    button.id = work.id;
    figure.appendChild(button);
}

// Add 'selected' class to a category
function addSelectedClass(categoryId) {
    document.getElementById("category" + categoryId).classList.add("selected");
}

// Remove 'selected' class from categories
function removeSelectedClass() {
    let filters = document.querySelectorAll(".category");
    for (let i = 0; i < filters.length; i++) {
        filters[i].classList.remove("selected");
    }
}

// Handle login/logout functionality
function gestion_login() {
    if (sessionStorage.getItem("token")) {
        // Change "login" to "logout"
        let loginLogoutLink = document.getElementById("login_logout");
        loginLogoutLink.textContent = "logout";

        // Display the edit banner
        let bandeau_edit = document.getElementById("edition");
        bandeau_edit.style.display = "flex";

        // Display the project modification
        let projet_modif = document.getElementById("modif_projet");
        projet_modif.style.display = "inline";

        // Hide filters in edit mode
        let button_filter = document.querySelector(".filter");
        button_filter.style.display = "none";

        // Handle logout when clicked
        loginLogoutLink.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove the token from session storage
            sessionStorage.removeItem("token");

            // Redirect to the homepage
            window.location.href = "index.html";
        });
    }
}

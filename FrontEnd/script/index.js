// Function to fetch data from the API with error handling
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Function to create an element with attributes
function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
}

// Function to create portfolio items
function createPortfolioItem(item) {
    const fichesPortfolio = createElement("figure");
    const imgElement = createElement("img", { src: item.imageUrl });
    const descriptionElement = createElement("figcaption");
    descriptionElement.innerText = item.title;

    fichesPortfolio.appendChild(imgElement);
    fichesPortfolio.appendChild(descriptionElement);

    return fichesPortfolio;
}

// Function to clear the gallery
function clearGallery() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
}

// Function to create filter buttons
function createFilterButton(name, attribut, tagElement, filterFunction) {
    const btn = createElement("button", { innerText: name, className: `btn ${attribut}` });
    
    btn.addEventListener("click", () => {
        clearGallery();
        filterFunction();
    });

    tagElement.appendChild(btn);
}

// Main function to initialize the portfolio
async function initializePortfolio() {
    const apiUrl = "http://localhost:5678/api/works";
    
    try {
        const portfolio = await fetchData(apiUrl);

        createPortfolio(portfolio);
        
        const filtrePortfolio = document.querySelector("#filtre-portfolio");

        createFilterButton("Tous", "btn-all", filtrePortfolio, () => createPortfolio(portfolio));
        createFilterButton("Objets", "btn-objects", filtrePortfolio, () => filterPortfolio(portfolio, 1));
        createFilterButton("Appartements", "btn-appart", filtrePortfolio, () => filterPortfolio(portfolio, 2));
        createFilterButton("Hôtels & restaurants", "btn-hotel", filtrePortfolio, () => filterPortfolio(portfolio, 3));

    } catch (error) {
        // Handle error
    }
}

// Function to filter portfolio based on category
function filterPortfolio(portfolio, categoryId) {
    const filteredItems = portfolio.filter(item => item.categoryId === categoryId);
    createPortfolio(filteredItems);
}

// Call the main initialization function
initializePortfolio();

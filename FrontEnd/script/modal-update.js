// CONSTANTS
const modalNew = document.querySelector(".modal-update");
const buttonCloseNew = document.querySelector('.js-modal-close-new');
const buttonBack = document.querySelector('.modal-back');
const buttonAdd = document.querySelector('.button-add-photo');
const inputPicture = document.querySelector('#input-picture');
const picturePreview = document.querySelector('#picture-preview');
const pictureSelection = document.querySelector('.picture-selection');
const categoriesSelect = document.querySelector('.select-category');
const titleNewPhoto = document.querySelector('.input-titre');
const buttonSubmit = document.querySelector('.button-submit');

let modalNewInstance = null;

// OPEN MODAL FUNCTION
const openModalNew = function (e) {
    e.preventDefault();
    // Hide the modal-gallery
    modal.style.display = "none";
    // Display the new photo modal
    modalNewInstance = document.querySelector("#modal2");
    modalNewInstance.style.display = null;
    modalNewInstance.addEventListener('click', closeModalNew);
    buttonCloseNew.addEventListener('click', closeModalNew);
    let modalWrapper = document.querySelector(".modal-wrapper-new");
    modalWrapper.style.display = "flex";
    resetPhotoSelection(); // Reset photo selection
    resetForm(); // Reset the add photo form
    loadCategories();
}

// CLOSE MODAL FUNCTION
const closeModalNew = function (e) {
    if (modalNewInstance == null) return;

    // Check if clicking outside the modal or on specific elements
    if (e.target != modalNewInstance && e.target != buttonCloseNew && e.target != document.querySelector('.top .fa-x')) return;

    e.preventDefault();
    modalNewInstance.style.display = "none";
    modalNewInstance.removeEventListener('click', closeModalNew);
    buttonCloseNew.removeEventListener('click', closeModalNew);
}

// BUTTON BACK
buttonBack.addEventListener("click", function () {
    modalNewInstance.style.display = "none";
    modal.style.display = "flex";
});

// BUTTON ADD PHOTO
buttonAdd.addEventListener("click", function () {
    inputPicture.click();
});

// SELECT FILE INPUT
inputPicture.addEventListener("change", function () {
    if (this.files[0].size > 4194304) {
        alert("File too large");
        this.value = "";
    };
    if (this.files[0]) {
        picturePreview.src = URL.createObjectURL(this.files[0]);
        picturePreview.style.display = "block";
        pictureSelection.style.display = "none";
    }
});

// RESET PHOTO SELECTION
function resetPhotoSelection() {
    inputPicture.value = "";
    picturePreview.src = "";
    picturePreview.style.display = "none";
    pictureSelection.style.display = "block";
}

// RESET ADD PHOTO FORM
function resetForm() {
    categoriesSelect.value = 0;
    titleNewPhoto.value = "";
}

// LOAD CATEGORIES FROM API
function loadCategories() {
    categoriesSelect.innerHTML = ''; // Clear before fetching to avoid duplicate categories
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    categoriesSelect.add(option); // Add empty category to the form
    fetch(CATEGORY_API)
        .then(response => response.json())
        .then(categories => {
            for (let category of categories) {
                let option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoriesSelect.add(option);
            }
        })
}

// UPLOAD NEW PROJECT
const uploadWork = function () {
    let token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", inputPicture.files[0]);
    formData.append("title", titleNewPhoto.value);
    formData.append("category", categoriesSelect.value);

    fetch(WORKS_API, {
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                resetPhotoSelection(); // Reset photo preview
                resetForm(); // Reset form
                refreshWorks(GALLERY_MODALE, true); // Refresh works in modal
                refreshWorks(GALLERY_DIV, false); // Refresh works in index
                verification();
            } else if (response.status === 401) {
                alert('Session expired or invalid');
            } else {
                alert('Unknown technical error');
            }
        })
}

// FORM VERIFICATION
const verification = function () {
    if (inputPicture.value != "" && categoriesSelect.value != 0 && titleNewPhoto.value != "") {
        buttonSubmit.style.backgroundColor = "#1D6154";
        buttonSubmit.style.cursor = "pointer";
        buttonSubmit.addEventListener("click", uploadWork);

    } else {
        buttonSubmit.style.backgroundColor = "#A7A7A7";
        buttonSubmit.style.cursor = "default";
        buttonSubmit.removeEventListener("click", uploadWork);
    }
}

// Event listeners for form verification
inputPicture.addEventListener("change", verification);
categoriesSelect.addEventListener("change", verification);
titleNewPhoto.addEventListener("change", verification);

// Event listener to open new modal for elements with ID 'ajout_projet'
document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', openModalNew);
});

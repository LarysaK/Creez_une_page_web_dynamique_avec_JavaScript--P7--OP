// CONSTANTS
const GALLERY_MODALE = document.querySelector(".modal-gallery");
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1');
const MODALE_WRAPPER = document.querySelector(".modal-wrapper");
const BUTTON_MODIF_WORKS = document.querySelector('#modif_projet');

let modal = null

// FUNCTION: OPEN MODAL
const OPEN_MODAL = function (e) {
    e.preventDefault()
    modal=document.querySelector("#modal1");
    modal.style.display=null
    modal.addEventListener('click', CLOSE_MODAL)
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL)
    MODALE_WRAPPER.style.display="flex"
    GALLERY_MODALE.innerHTML = '';
    fetchWorks(GALLERY_MODALE, true);
}


// FUNCTION: CLOSE MODAL
const CLOSE_MODAL = function (e) {
    if (modal==null) return
    // Check if clicked outside the modal or on the close button
    if (e.target != modal && e.target != BUTTON_CLOSE && e.target != document.querySelector('.fa-solid') ) return
    e.preventDefault
    // Hide the modal
    modal.style.display="none"
    // Remove event listeners
    modal.removeEventListener('click',CLOSE_MODAL)
    BUTTON_CLOSE.removeEventListener ('click',CLOSE_MODAL)

}

// Add listener to the "Modifier Projet" button to open the modal 
BUTTON_MODIF_WORKS.addEventListener('click', OPEN_MODAL)

// FUNCTION: DELETE WORK
const DELETE_WORK = function (e) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id);
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error);
        }
    }
}

// API CALL: DELETE WORK
function deleteWorkFetch(idWork){
    let token = sessionStorage.getItem("token");

    fetch (WORKS_API+'/'+idWork, {
        method: "DELETE",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then (response => {
        if (response.status===200 || response.status===201 || response.status===204){
            refreshWorks(GALLERY_MODALE, true); //Refresh works in the modal
            refreshWorks(GALLERY_DIV,false); //Refresh works in the index
        }else {
            alert ("Erreur lors de la suppression du projet.")
        }
    })

}
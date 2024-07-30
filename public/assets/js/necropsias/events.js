import { processForm, sendRequest, addRowToTable, closeModal, deleteNecropsia } from './necropsia.js';

export const events = {
    formSubmit: async (event) => {
        event.preventDefault();
        try {
            const formObject = processForm(event);
            const response = await sendRequest(formObject);
            if (response.success) {
                formObject._id = response.insertedId; // Agregamos el _id al formObject
                addRowToTable(formObject);
                closeModal();
            } else {
                throw new Error(response.message || 'Error desconocido al guardar necropsia');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    deleteButton: async (event) => {
        if (event.target.classList.contains('btn-delete') || event.target.parentNode.classList.contains('btn-delete')) {
            const button = event.target.classList.contains('btn-delete') ? event.target : event.target.parentNode;
            const id = button.getAttribute('data-id');
            const cardTitle = button.closest('.card').querySelector('.card-title');
            const collectionName = cardTitle.textContent.trim();
            console.log(id, collectionName);
            try {
                await deleteNecropsia(id, collectionName);
            } catch (error) {
                console.error('Error al eliminar la necropsia:', error);
                iziToast.error({
                    title: 'Error',
                    message: 'Error al eliminar la necropsia',
                    position: 'topRight',
                    transitionIn: 'fadeInLeft',
                    transitionOut: 'fadeOutRight'
                });
            }
        }
    }
};

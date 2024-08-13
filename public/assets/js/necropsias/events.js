import { processForm, sendRequest, addRowToTable, closeModal, deleteNecropsia, editRequest,updateRowInTable } from './necropsia.js';



export const events = {
    formSubmit: async (event, table) => {
        event.preventDefault();
        let id = $('#exampleModal').data('idEditar');
        console.log(id);
        const formObject = processForm(event);
        if (id) {
            // Si se está editando un registro, llama a editRequest
            const response = await editRequest(formObject, id);
            if (response.success) {
                /*table.rows('#' + id).select();*/
                // Actualiza la tabla con los datos actualizados
                updateRowInTable(formObject, id);
                closeModal();
            } else {
                throw new Error(response.message || 'Error desconocido al actualizar necropsia');
            }
        } else {
            // Si no se está editando un registro, llama a sendRequest
            const response = await sendRequest(formObject);
            if (response.success) {
                formObject._id = response.insertedId; // Agregamos el _id al formObject
                addRowToTable(formObject);
                closeModal();
            } else {
                throw new Error(response.message || 'Error desconocido al guardar necropsia');
            }
        }
    },
    /*formSubmit: async (event) => {
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
    },*/

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

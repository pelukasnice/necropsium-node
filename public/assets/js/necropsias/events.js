import { addRowToTable, updateRowInTable, editNecropsia } from './necro-table.js';
import { processForm, sendRequest, deleteNecropsia, editRequest, } from './necropsia.js';


const closeModal = () => {
    $('#exampleModal').modal('hide');
};

$('#exampleModal').on('hidden.bs.modal', function () {
    const cadaverForm = document.getElementById("cadaver-form");
    cadaverForm.reset(); // Restablecer el formulario al cerrar el modal    
});


$('#exampleModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    if (button.hasClass('btn-primary')) {
        $('#legajo').removeAttr('readonly');
        $('#legajo').val('');
        $('#exampleModalLabel').text('Agregar una Necropsia');
        $('#btnGuardar').text('Guardar Necro');
        $('#exampleModal').data('idEditar', null);
    }
});




export const events = {

    formSubmit: async (event) => {
        event.preventDefault();
        let id = $('#exampleModal').data('idEditar');

        /*console.log(id);*/
        const formObject = processForm(event);
        if (id) {
            // Si se está editando un registro, llama a editRequest
            const response = await editRequest(formObject, id);
            if (response.success) {
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

    deleteButton: async (event) => {
        if (event.target.classList.contains('btn-delete') || event.target.parentNode.classList.contains('btn-delete')) {
            const button = event.target.classList.contains('btn-delete') ? event.target : event.target.parentNode;
            const id = button.getAttribute('data-id');
            const cardTitle = button.closest('.card').querySelector('.card-title');
            const collectionName = cardTitle.textContent.trim();
            /*console.log(id, collectionName);*/
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




import { processForm, sendRequest, addRowToTable, deleteNecropsia, editRequest,updateRowInTable } from './necropsia.js';

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

    formSubmit: async (event, table) => {
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



$(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const cardTitleElement = document.querySelector('h4.card-title');
    let collectionName = cardTitleElement.textContent.trim();
    /*console.log(collectionName);*/
    

    // Fetch data
    $.ajax({
        type: 'GET',
        url: `/necropsias/ajax/${collectionName}/${id}`,
        success: function (response) {
            const formObject = response.data;
            const fechaIngreso = new Date(formObject.fecha_ingreso);
            const fechaIngresoString = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}-${String(fechaIngreso.getDate()).padStart(2, '0')}`;

            $(document).ready(function () {
                try {
                    // Llena los campos del formulario                    
                    $('#legajo').attr('value', formObject.legajo).attr('readonly', true);                    
                    $('#expediente').val(formObject.expediente);
                    $('#oficina_fiscal').val(formObject.oficina_fiscal);
                    $('#apellido').val(formObject.apellido);
                    $('#nombre').val(formObject.nombre);
                    $('#edad').val(formObject.edad);
                    // radio buttons
                    $('input[name="sexo"][value="' + formObject.sexo + '"]').prop('checked', true);
                    $('#fecha_ingreso').val(fechaIngresoString);
                    $('#perito').val(formObject.perito);
                    $('#codigos').val(formObject.codigo);
                    $('#localidad').val(formObject.localidad);

                    $('#exampleModalLabel').text('Editar Necropsia');
                    $('#btnGuardar').text('Editar Necro');


                    // Open the modal
                    $('#exampleModal').data('idEditar', id).modal('show');

                } catch (error) {
                    console.error("Error setting form field values:", error);
                }
            });
        }
    });


});

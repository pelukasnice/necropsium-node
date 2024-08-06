
const iziToast = window.iziToast;


export const processForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(Array.from(formData).map(([key, value]) => [key, value.trim()]));
    console.log('formObject creado:', JSON.stringify(formObject, null, 2));
    return formObject;
};

export const sendRequest = async (formObject) => {
    console.log('formObject antes de enviar:', formObject);
    const apiEndpoint = '/necropsias/save-necropsia';
    const jsonBody = JSON.stringify(formObject);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(apiEndpoint, { ...requestOptions, signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        iziToast.success({
            title: 'Éxito',
            message: 'La solicitud ha sido enviada con éxito',
            position: 'topRight',
            transitionIn: 'fadeInLeft',
            transitionOut: 'fadeOutRight'
        });

        return await response.json();

    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        throw error;
    }
};

export const addRowToTable = (formObject) => {
    const table = $('#basic-datatables').DataTable();
    const newRow = table.row.add({
        legajo: formObject.legajo,
        oficina_fiscal: formObject.oficina_fiscal,
        expediente: formObject.expediente,
        nombre_apellido: `${formObject.nombre} ${formObject.apellido}`,
        edad: formObject.edad,
        perito: formObject.perito,
        codigo: formObject.codigo,
        fecha_ingreso: formObject.fecha_ingreso,
        visado: formObject.visado === 'true' ? '<span class="badge badge-success">VISADO</span>' : '<span class="badge badge-warning">NO</span>',
        observaciones: formObject.observaciones || '',
        acciones: `
        <button class="btn btn-view" title="Ver"  data-id="${formObject._id}"><i class="fas fa-eye"></i></button>
        <button class="btn btn-edit" title="Editar" data-id="${formObject._id}"><i class="fas fa-pencil-alt"></i></button>
        <button class="btn btn-delete" title="Eliminar" data-id="${formObject._id}"><i class="fas fa-trash-alt"></i></button>
      `,
    }).draw(false);

};

export const deleteNecropsia = async (id, collectionName) => {
    const apiEndpoint = '/necropsias/deleteNecro/${id}/${collectionName}';
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, collectionName: collectionName })
    };

    try {
        const response = await fetch(apiEndpoint, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const responseData = await response.json();

        if (responseData.success) {
            iziToast.success({
                title: 'Éxito',
                message: 'Necropsia eliminada con éxito',
                position: 'topRight',
                transitionIn: 'fadeInLeft',
                transitionOut: 'fadeOutRight'
            });

            // Eliminar la fila de DataTable
            $('#basic-datatables').DataTable().row($(`button[data-id="${id}"]`).closest('tr')).remove().draw();
        } else {
            throw new Error(responseData.message || 'Error desconocido al eliminar necropsia');
        }
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
};


$(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const cardTitleElement = document.querySelector('h4.card-title');
    let collectionName = cardTitleElement.textContent.trim();
    console.log(collectionName);

    // Fetch and fill the form data
    $.ajax({
        type: 'GET',
        url: `/necropsias/ajax/${collectionName}/${id}`,
        success: function (response) {
            const formObject = response.data;
            const fechaIngreso = new Date(formObject.fecha_ingreso);
            const fechaIngresoString = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}-${String(fechaIngreso.getDate()).padStart(2, '0')}`;

            // Asegúrate de que el formulario esté completamente cargado
            $(document).ready(function () {
                try {
                    // Llena los campos del formulario
                    $('#legajo').attr('value', formObject.legajo);
                    $('#expediente').val(formObject.expediente);
                    $('#oficina_fiscal').val(formObject.oficina_fiscal);
                    $('#apellido').val(formObject.apellido);
                    $('#nombre').val(formObject.nombre);
                    $('#edad').val(formObject.edad);

                    // Para los radio buttons
                    $('input[name="sexo"][value="' + formObject.sexo + '"]').prop('checked', true);

                    // Otros campos de ejemplo
                    $('#fecha_ingreso').val(fechaIngresoString);
                    $('#perito').val(formObject.perito);
                    $('#codigos').val(formObject.codigo);
                    $('#localidad').val(formObject.localidad);

                    // Open the modal
                    $('#exampleModal').modal('show');
                } catch (error) {
                    console.error("Error setting form field values:", error);
                }
            });
        }
    });
});



export const closeModal = () => {
    $('#exampleModal').modal('hide');
};

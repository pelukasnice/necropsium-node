
// ACTUALIZAR LA FILA DE LA TABLA QUE SE EDITO

export const updateRowInTable = (formObject, id) => {
    const table = $('#basic-datatables').DataTable();
    const row = table.row(function (idx, data, node) {
        return data._id === id;
    });

    if (row.length === 0) {
        console.error(`No se encontró la fila con ID ${id}`);
        return;
    }

    row.data({
        "legajo": formObject.legajo,
        "expediente": formObject.expediente,
        "oficina_fiscal": formObject.oficina_fiscal,
        "apellido": formObject.apellido,
        "nombre": formObject.nombre,
        "edad": formObject.edad,
        "sexo": formObject.sexo,
        "fecha_ingreso": formObject.fecha_ingreso,
        "perito": formObject.perito,
        "codigo": formObject.codigo,
        "localidad": formObject.localidad
    });

    table.ajax.reload(null, false);    
}


// AÑADE UNA FILA CUANDO SE AGREGA UNA NECROPSIA

export const addRowToTable = (formObject) => {
    const table = $('#basic-datatables').DataTable();
    console.log('Agregando fila:', formObject);
    console.log('_id:', formObject['_id']);
    console.log('Entire formObject:', JSON.stringify(formObject, null, 2));

    const newRow = table.row.add({
        legajo: formObject.legajo,
        oficina_fiscal: formObject.oficina_fiscal,
        expediente: formObject.expediente,
        nombre: formObject.nombre,
        apellido: formObject.apellido.toUpperCase(),
        edad: formObject.edad,
        perito: formObject.perito,
        codigo: formObject.codigo,
        fecha_ingreso: formObject.fecha_ingreso,
        visado: getVisadoBadge(formObject.visado),
        /*observaciones: formObject.observaciones || '',*/
        acciones: getActions(formObject._id),
        _id: formObject._id,
    }).draw(false);
};

const getVisadoBadge = (visado) => {
    return visado === 'true'
        ? '<span class="badge badge-success">VISADO</span>'
        : '<span class="badge badge-warning">NO</span>';
};

const getActions = (_id) => {
    return `
      <button class="btn btn-view" title="Ver" data-id="${_id}"><i class="fas fa-eye"></i></button>
      <button class="btn btn-edit" title="Editar" data-id="${_id}"><i class="fas fa-pencil-alt"></i></button>
      <button class="btn btn-delete" title="Eliminar" data-id="${_id}"><i class="fas fa-trash-alt"></i></button>
    `.replace(/\${_id}/g, _id);/*reemplaza todas las ocurrencias de ${_id} en la plantilla literal con el valor real de _id. Esto es necesario porque las plantillas literales no reemplazan automáticamente las variables dentro de ellas.*/
};


// ABRE Y LLENA EL FORMULARIO CUANDO SE HACE CLICK EN EDITAR

export const editNecropsia = async (id) => {
    const cardTitleElement = document.querySelector('h4.card-title');
    let collectionName = cardTitleElement.textContent.trim();

    try {
        // Fetch data
        const response = await $.ajax({
            type: 'GET',
            url: `/necropsias/ajax/${collectionName}/${id}`,
        });

        const formObject = response.data;
        const fechaIngreso = new Date(formObject.fecha_ingreso);
        const fechaIngresoString = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}-${String(fechaIngreso.getDate()).padStart(2, '0')}`;

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
};
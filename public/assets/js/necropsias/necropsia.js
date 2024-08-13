
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

export const editRequest = async (formObject, id) => {
    console.log('formObject antes de enviar:', formObject);
    const apiEndpoint = `/necropsias/updateNecro/${formObject.collectionName}/${id}`;
    const jsonBody = JSON.stringify(formObject);
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody
    };

    try {
        const response = await fetch(apiEndpoint, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        iziToast.success({
            title: 'Éxito',
            message: 'La solicitud ha sido actualizada con éxito',
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





export const updateRowInTable = (formObject, id) => {
    const table = $('#basic-datatables').DataTable();
    const row = table.row(function (idx, data, node) {
        return data._id === id;
    });
    console.log(row);
    console.log(`Updating row with ID ${id}`);

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




export const processForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(Array.from(formData).map(([key, value]) => [key, value.trim()]));
    return formObject;
};

export const sendRequest = async (formObject) => {
    const apiEndpoint = '/necropsias/save-necropsia';
    const contentType = 'application/json';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: JSON.stringify(formObject),
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(apiEndpoint, { ...requestOptions, signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        <button class="btn btn-view" title="Ver"><i class="fas fa-eye"></i></button>
        <button class="btn btn-edit" title="Editar"><i class="fas fa-pencil-alt"></i></button>
      `,
    }).draw(false);
    highlightRow(newRow.node());
};

const highlightRow = (rowNode) => {
    $(rowNode).addClass('highlight');
    setTimeout(() => $(rowNode).removeClass('highlight'), 3000);
};

export const closeModal = () => {
    $('#exampleModal').modal('hide');
};

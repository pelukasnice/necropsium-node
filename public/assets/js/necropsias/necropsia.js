
const iziToast = window.iziToast;
/*export const processForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = {      
        anio_necropsia: formData.get('anio_necropsia'),
        legajo: formData.get('legajo'),
        expediente: formData.get('expediente'),
        oficina_fiscal: formData.get('oficina_fiscal'),
        apellido: formData.get('apellido'),
        nombre: formData.get('nombre'),
        edad: formData.get('edad'),
        sexo: formData.get('sexo'),
        fecha_ingreso: formData.get('fecha_ingreso'),
        perito: formData.get('perito'),
        causa: formData.get('codigo'),
        localidad: formData.get('localidad'),      
    };
    return formObject;
  };*/

export const processForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(Array.from(formData).map(([key, value]) => [key, value.trim()]));
    console.log('formObject creado:', JSON.stringify(formObject, null, 2));
    return formObject;
};
/*export const processForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(Array.from(formData).map(([key, value]) => [key, value.trim()]));
    console.log('formObject creado:', formObject);
    return formObject;
};*/
/*const apiEndpoint = '/necropsias/save-necropsia';
  const jsonBody = JSON.stringify(formObject);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonBody,
  };
/*export const sendRequest = async (formObject) => {
    const apiEndpoint = '/necropsias/save-necropsia';
    const contentType = 'application/json';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: JSON.stringify(formObject),
    };*/

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
        <button class="btn btn-view" title="Ver"><i class="fas fa-eye"></i></button>
        <button class="btn btn-edit" title="Editar"><i class="fas fa-pencil-alt"></i></button>
      `,
    }).draw(false);

};



export const closeModal = () => {
    $('#exampleModal').modal('hide');
};

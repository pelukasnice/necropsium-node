
export function initDataTable(collectionName) {
    const table = $('#basic-datatables').DataTable({
        ajax: {
            url: `/necropsias/ajax/${collectionName}`,
            type: 'GET',
            dataSrc: function (json) {
                return json;
            }
        },
        columns: [
            { data: 'legajo', name: 'legajo', width: '2%' },
            { data: 'oficina_fiscal', name: 'oficina_fiscal', width: '5%' },
            { data: 'expediente', name: 'expediente', width: '10%' },
            {
                data: null,
                name: 'nombre_apellido',
                width: '20%',
                render: function (data, type, row) {
                    return `${row.nombre} ${row.apellido}`;
                }
            },
            { data: 'edad', name: 'edad', width: '2%' },
            { data: 'perito', name: 'perito', width: '10%' },
            { data: 'codigo', name: 'codigo', width: '5%' },
            { data: 'fecha_ingreso', name: 'fecha_ingreso', width: '10%' },
            { data: 'visado', name: 'visado', width: '10%' },
            { data: 'visado', name: 'visado', width: '10%' },
            {
                data: null,
                name: 'acciones',
                width: '20%',
                orderable: false,
                searchable: false,
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                    <button class="btn" title="Ver">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" title="Editar" data-id="${row._id}">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn btn-delete" title="Eliminar" data-id="${row._id}">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  `;
                }
            }
        ],
        language: {
            url: '/assets/js/plugin/datatables/Spanish.json'
        },
        responsive: true,
        order: [[0, 'desc']], // Ordenar por la columna 'fecha_ingreso' en orden descendente
        pageLength: 10,
        dom: 'Bfrtip'
    });
}

/*export function initDataTable() {
    const table = $('#basic-datatables').DataTable({

        columns: [
            { data: 'legajo', name: 'legajo',width: '2%' },
            { data: 'oficina_fiscal', name: 'oficina_fiscal',width: '5%' },
            { data: 'expediente', name: 'expediente',width: '10%' },
            { data: 'nombre_apellido', name: 'nombre_apellido',width: '20%' },
            { data: 'edad', name: 'edad',width: '2%' },
            { data: 'perito', name: 'perito',width: '10%' },
            { data: 'codigo', name: 'codigo',width: '5%' },
            { data: 'fecha_ingreso', name: 'fecha_ingreso',width: '10%' },
            { data: 'visado', name: 'visado',width: '10%' },
            { data: 'observaciones', name: 'observaciones',width: '5%' },
            {
                data: 'acciones', name: 'acciones',
                width: '20%',
                orderable: false,
                searchable: false,
                className: 'text-center',             
            }
        ],
        language: {
            url: '/assets/js/plugin/datatables/Spanish.json'
        },
        responsive: true,
        order: [[0, 'desc']], // Ordenar por la columna 'fecha_ingreso' en orden descendente
        pageLength: 10,
        dom: 'Bfrtip'

    });

    return table;
}*/
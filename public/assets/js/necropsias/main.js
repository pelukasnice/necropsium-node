import { initDataTable } from './datatable.js';
import { events } from './events.js';

function initApp() {
    // Inicializa la tabla de datos
    initDataTable();

    // Agrega el listener para el formulario de submit
    document.getElementById('cadaver-form').addEventListener('submit', events.formSubmit);
}

// Auto-ejecución de initApp()
initApp();

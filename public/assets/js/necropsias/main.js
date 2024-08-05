import { initDataTable } from './datatable.js';
import { events } from './events.js';

function initApp() {
    const cardTitleElement = document.querySelector('h4.card-title');
    const collectionName = cardTitleElement.textContent.trim();
    // Inicializa la tabla de datos
    initDataTable(collectionName);

    // Agrega el listener para el formulario de submit
    document.getElementById('cadaver-form').addEventListener('submit', events.formSubmit);
    

    document.addEventListener('click', events.deleteButton);
}

// Auto-ejecución de initApp()
initApp();

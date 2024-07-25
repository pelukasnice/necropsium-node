import { processForm, sendRequest, addRowToTable, closeModal } from './necropsia.js';

export const events = {
    formSubmit: async (event) => {
        event.preventDefault();
        try {
            const formObject = processForm(event);
            const response = await sendRequest(formObject);
            if (response.success) {
                addRowToTable(formObject);
                closeModal();
            } else {
                throw new Error(response.message || 'Error desconocido al guardar necropsia');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    // Otros event listeners pueden ser añadidos aquí
};

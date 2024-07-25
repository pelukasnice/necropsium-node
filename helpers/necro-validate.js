const { body } = require('express-validator');

const sexoEnum = ['masculino', 'femenino'];
const visadoEnum = [true, false];

const validateNecropsiaInput = [
    body('collectionName').notEmpty().withMessage('La colección es obligatoria'),
    body('legajo').notEmpty().withMessage('El legajo es obligatorio'),
    body('expediente').notEmpty().withMessage('El expediente es obligatorio'),
    body('edad').isInt({ gt: -1 }).withMessage('La edad debe ser un entero no negativo'),
    body('sexo').custom((value) => {
        if (!sexoEnum.includes(value)) {
            throw new Error('El sexo debe ser masculino o femenino');
        }
        return true;
    }),
    body('visado').custom((value) => {
        if (!visadoEnum.includes(value)) {
            throw new Error('El visado debe ser true o false');
        }
        return true;
    }),
    body('oficina_fiscal').notEmpty().withMessage('La oficina fiscal es obligatoria'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('localidad').notEmpty().withMessage('La localidad es obligatoria'),
    body('codigo').notEmpty().withMessage('El código es obligatorio'),
    body('perito').notEmpty().withMessage('El perito es obligatorio'),
    body('fecha_ingreso').notEmpty().withMessage('La fecha de ingreso es obligatoria'),
    body('anio_necropsia').isInt({ gt: -1 }).withMessage('El año de necropsia debe ser un entero no negativo'),
];

module.exports = validateNecropsiaInput;

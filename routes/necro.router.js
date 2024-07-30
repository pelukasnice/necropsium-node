const { Router } = require('express');
const { getAllNecros, guardarNecro, deleteNecro } = require('../controllers/necropsias.controller');
const validateNecropsiaInput = require('../helpers/necro-validate');
const { validarCampos } = require('../middlewares/validar-campos');
const { check, validationResult } = require('express-validator');

const router = Router();


router.get('/:collectionName', getAllNecros);

router.post('/save-necropsia', /*[
    check('legajo', 'El nombre es obligatorio').not().isEmpty(),
    check('expediente', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'El nombre es obligatorio').not().isEmpty(),
    check('sexo', 'El nombre es obligatorio').not().isEmpty(),
    check('oficina_fiscal', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El nombre es obligatorio').not().isEmpty(),
    check('localidad', 'El nombre es obligatorio').not().isEmpty(),
    check('codigo', 'El nombre es obligatorio').not().isEmpty(),
    check('perito', 'El nombre es obligatorio').not().isEmpty(),
    check('fecha_ingreso', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], */guardarNecro);

router.delete('/deleteNecro/:id/:collectionName', deleteNecro)

module.exports = router;


/*router.post('/save-necropsia',guardarNecro)*/
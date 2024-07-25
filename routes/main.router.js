const { Router } = require('express');
const { guardarNecro, getAllNecros } = require('../controllers/necropsias.controller');
mongoose = require('mongoose');
const validateNecropsiaInput = require('../helpers/necro-validate');
const { validarCampos } = require('../middlewares/validar-campos');
const { check,validationResult } = require('express-validator');




const router = Router();

// Ruta para la página de inicio
router.get('/', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.render('index', { collections });
    } catch (error) {
        console.error('Error al obtener colecciones:', error);
        res.status(500).send('Error al obtener colecciones');
    }
});


router.post('/create-collection', async (req, res) => {
    const { collectionName } = req.body;
    try {
        await mongoose.connection.createCollection(collectionName);
        console.log(`Colección ${collectionName} creada exitosamente.`);
        res.status(200).json({ message: `Colección ${collectionName} creada exitosamente.` });
    } catch (error) {
        console.error('Error creando la colección:', error);
        res.status(500).json({ error: 'Error al crear la colección', details: error.message });
    }
});
router.post('/:collectionName/save-necropsia',[    
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
], (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(422).json({ errores: errores.array() });
    }
    // Si no hay errores, guardar la necropsia
    guardarNecro(req, res);
  });
//router.get('/collection/:collectionName', getAllNecros);

/*router.post('/:collection/save-necropsia', guardarNecro)*/


module.exports = router;

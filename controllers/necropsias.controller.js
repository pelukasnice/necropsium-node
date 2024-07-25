mongoose = require("mongoose");
const { Necropsia } = require("../models/Necropsia.model");


const getAllNecros = async (req, res) => {
    try {
        const collectionName = req.params.collectionName;
        // Aquí podrías extraer el año de collectionName, por ejemplo:
        const year = collectionName.split('_')[1];

        // Obtener el modelo de la colección específica
        const CollectionModel = mongoose.model(collectionName, Necropsia.schema);

        // Consultar todas las necropsias de la colección
        const necropsias = await CollectionModel.find().exec();

        // Obtener todas las colecciones disponibles
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Renderizar la vista 'datatable' y pasar los datos
        res.render('datatable', {
            collections: collections,
            collectionName: collectionName,
            data: necropsias,
            year: year
        });
    } catch (error) {
        console.error('Error al obtener necropsias:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
};



const guardarNecro = async (req, res) => {
    try {
        /*const { error } = validateNecropsiaInput(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }*/
        const collectionName = req.body.collectionName;
        const collection = mongoose.connection.db.collection(collectionName);

        const necropsia = new Necropsia(req.body);
        /*await necropsia.save();*/

        const result = await collection.insertOne(necropsia.toObject());
        res.json({ success: true, message: 'Necropsia guardada con éxito', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error al guardar la necropsia:', error);
        res.status(500).json({ success: false, message: 'Error al guardar la necropsia: ' + error.message });
    }
};


/*const guardarNecro = async (req, res) => {
    try {
        const {
            collectionName,
            legajo,
            expediente,
            oficina_fiscal,
            nombre,
            apellido,
            edad,
            sexo,
            localidad,
            codigo,
            perito,
            fecha_ingreso,
            visado,
            anio_necropsia
        } = req.body;

        const collection = mongoose.connection.db.collection(collectionName);

        const result = await collection.insertOne({
            legajo,
            expediente,
            oficina_fiscal,
            nombre,
            apellido,
            edad: parseInt(edad),
            sexo,
            localidad,
            codigo,
            perito,
            fecha_ingreso: new Date(fecha_ingreso),
            visado: visado === 'true',
            anio_necropsia: parseInt(anio_necropsia),
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date()
        });

        res.json({ 
            success: true, 
            message: 'Necropsia guardada con éxito',
            insertedId: result.insertedId
        });
    } catch (error) {
        console.error('Error al guardar la necropsia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la necropsia: ' + error.message
        });
    }
};*/



module.exports = {
    getAllNecros,
    guardarNecro
}


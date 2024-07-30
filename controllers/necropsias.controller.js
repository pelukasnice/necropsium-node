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
        const {
            collectionName,
            ...necropsiaData
        } = req.body;

        const collection = mongoose.connection.db.collection(collectionName);

        const necropsia = await createNecropsia(necropsiaData);

        const result = await collection.insertOne(necropsia);

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
};

const createNecropsia = (data) => {
    return {
        legajo: data.legajo,
        expediente: data.expediente,
        oficina_fiscal: data.oficina_fiscal,
        nombre: data.nombre,
        apellido: data.apellido.toUpperCase(),
        edad: parseInt(data.edad),
        sexo: data.sexo,
        localidad: data.localidad,
        codigo: data.codigo,
        perito: data.perito,
        fecha_ingreso: new Date(data.fecha_ingreso),
        visado: data.visado === 'true',
        anio_necropsia: parseInt(data.anio_necropsia),
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
    };
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

const deleteNecro = async (req, res) => {
    try {
        const { id, collectionName } = req.body;

        const collection = mongoose.connection.db.collection(collectionName);

        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        if (result.deletedCount === 1) {
            res.json({
                success: true,
                message: 'Necropsia eliminada con éxito'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Necropsia no encontrada'
            });
        }
    } catch (error) {
        console.error('Error al eliminar la necropsia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la necropsia: ', error
        });
    }
};



module.exports = {
    getAllNecros,
    guardarNecro,
    deleteNecro
}


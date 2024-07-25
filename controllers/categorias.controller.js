const { Categoria, Necropsia } = require("../models/Necropsia.model");


async function crearCategoria(nombre, anio) {
    try {
        const nuevaCategoria = new Categoria({ nombre, anio });
        await nuevaCategoria.save();
        return nuevaCategoria;
    } catch (error) {
        console.error('Error al crear categoría:', error);
        throw error;
    }
}

async function obtenerCategorias() {
    try {
        return await Categoria.find().sort({ anio: -1, nombre: 1 });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
}

const getAllNecros = async (req, res) => {
    try {
        const collectionName = req.params.collectionName;
        
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
            data: necropsias
        });
    } catch (error) {
        console.error('Error al obtener necropsias:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    getAllNecros
}
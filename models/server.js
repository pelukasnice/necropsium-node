const express = require("express");
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('../database/db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.paths = {
            main:'/',
            necropsias:'/necropsias'            
            //auth:'/api/auth',
            // Otros endpoints comentados
            // buscar:'/api/buscar',
            // categorias:'/api/categorias',
            // usuarios: '/api/usuarios',
            // productos:'/api/productos',
            // uploads:'/api/uploads'
        };

        // Conectar a la base de datos
        this.conectarDB();
        
        // Configuración de middleware
        this.middlewares();

        // Configuración de vistas
        this.views();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static(path.join(__dirname, '../public')));

        /*this.app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));*/
    }

    views() {
        // Configuración del motor de plantillas EJS
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '../views'));
    }

    routes() {
        //this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.main, require('../routes/main.router.js'));
        this.app.use(this.paths.necropsias, require('../routes/necro.router'));

        // Rutas para renderizar vistas EJS
        /*this.app.get('/', (req, res) => {
            res.render('index');
        });*/

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;

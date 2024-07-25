const { Schema, model } = require('mongoose');

const causaMuerteEnum = {
    values: [
        //ASFIXIAS
        'NAS-CC',
        'NAS-VA',
        'NAS-TA',
        'NAS-CF',
        'NAS-BA',
        //ACCIDENTE TRANSITO
        'NAT-C',
        'NAT-A',
        'NAT-P',
        'NAT-CoA-MT',
        'NAT-CoA-AU',
        //ARMA BLANCA
        'NAB-SU',
        'NAB-HO',
        'NAB-AC',
        'NAB-VG',
        //ARMA FUEGO
        'NAF-SU',
        'NAF-HO',
        'NAF-AC',
        'NAF-VG',
        //CAIDA DE ALTURA/PRECIPITACION
        'NPC',
        //CAUSA INDETERMINADA
        'NCI',
        //ELECTROCUCION
        'NEL',
        //ENFERMEDAD NATURAL
        'NEN-CV',
        'NEN-RE',
        'NEN-NE',
        'NEN-ON',
        'NEN-IN',
        // EXAMEN EXTERNO
        'NEXT',
        //FETOS - RN
        'NFE-PT',
        'NFE-TE',
        'MRN',
        //MUERTE EN ALTURA
        'NMA-TR',
        'NMA-HT',
        'NMA-ED',
        // MUERTE EN CUSTODIA
        'NMC',
        //OTRAS CAUSAS NO ESPECIFICADAS
        'NOT',
        //QUEMADOS
        'NQU-SU',
        'NQU-HO',
        'NQU-AC',
        'NQU-VG',
        //RESTOS OSEOS
        'NRO',
        //SUMERSION
        'NSU-AC',
        'NSU-HO',
        'NSU-SU',
        //TRAUMATICA
        'NRT-V',
        'NRT-A',
        //VENENOS/TOXICOS
        'NVT-CN',
        'NVT-AS',
        'NVT-CO',
        'NVT-OT',
        'NVT-DA',
        'NVT-C',

    ],
};

const sexoEnum = {
    values: ['M', 'F', 'O']
};

const necropsiaSchema = new Schema({
    legajo: {
        type: String,
        //required: true,
        unique: true
    },
    expediente: {
        type: String,
        //required: true
    },
    oficina_fiscal: {
        type: String,
        //required: true
    },
    nombre: {
        type: String,
       // required: true
    },
    apellido: {
        type: String,
        //required: true
    },
    edad: {
        type: Number,
        //required: true
    },
    sexo: {
        type: String,
       // required: true,
        enum: sexoEnum
    },
    localidad: {
        type: String,
       // required: true
    },
    codigo: {
        type: String,
        //required: true,
        enum: causaMuerteEnum
    },
    perito: {
        type: String,
        //required: true
    },
    fecha_ingreso: {
        type: Date,
        //required: true
    },
    visado: {
        type: Boolean,
        default: false
    },
    anio_necropsia: {
        type: Number,
        //required: true
    },
    

}, {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }
});



const Necropsia = model('Necropsia', necropsiaSchema);
/*const Categoria = model('AnioNecro', categoriaSchema);*/

module.exports = {
    Necropsia,
    //Categoria
}

/*const necropsiaSchema = new Schema({
    legajo: {
        type: String,
        required: true,
        unique: true
    },
    expediente: {
        type: String,
        required: true
    },
    oficina_fiscal: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    sexo: {
        type: String,
        required: true,
        enum: sexoEnum
    },
    localidad: {
        type: String,
        required: true
    },
    causa_muerte: {
        type: String,
        required: true,
        enum: causaMuerteEnum
    },
    perito: {
        type: String,
        required: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_actualizacion: {
        type: Date,
        default: Date.now
    },
    fecha_ingreso: {
        type: Date,
        required: true
    },
    visado: {
        type: Boolean,
        default: false
    }
});

const Necro = model('Necropsias', necropsiaSchema);

module.exports = Necro;*/
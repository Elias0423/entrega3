const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuario = new Schema ({
    cedula : {
        type: Number,
        required: true
    },

    nombre : {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true
    },

    telefono : {
        type: Number,
        required: true
    },

    perfil : {
        type: String,
        default: 'Aspirante',
        enum: {
            values: ['Coordinador', 'Aspirante', 'Docente', 'Interesado']
        }
    }
})

module.exports = mongoose.model('usuario', usuario)
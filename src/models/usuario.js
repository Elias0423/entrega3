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

    correo : {
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
            values: ['Aspirante', 'Coordinador', 'Profesor', 'Interesado']
        }
    }
},   
{
  collection: 'usuario',
  toJSON: { virtuals: true },
  versionKey: false
})

module.exports = mongoose.model('usuario', usuario)
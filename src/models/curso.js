const mongoose = require('mongoose')
const Schema = mongoose.Schema

const curso = new Schema({
    idCurso: {
        type: Number,
        required: true
    },
    
    nombre: {
        type: String,
        required: true
    },

    descripcion: {
        type: String
    },

    costo: {
        type: Number
    },

    intensidad: {
        type: String
    },

    modalidad: {
        type: String,
        enum: {
            values: ['Virtual', 'Presencial']
        }
    },

    estado: {
        type: String,
        default: 'Disponible',
        enum: {
            values: ['Disponible', 'Finalizado', 'Cerrado']
        }
    }
},   
{
  collection: 'curso',
  toJSON: { virtuals: true },
  versionKey: false
})

module.exports = mongoose.model("curso", curso)
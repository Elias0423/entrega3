const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inscripcion = new Schema({
    idInscripcion: {
        type: Number
    },

    idUsuario: {
        type: Number
    },

    idCurso: {
        type: Number
    }
})

module.exports = mongoose.model("inscripcion", inscripcion)
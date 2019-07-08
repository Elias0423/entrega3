const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inscripcion = new Schema({
    cedula: {
        type: Number
    },

    idCurso: {
        type: Number
    }
},   
{
  collection: 'inscripcion',
  toJSON: { virtuals: true },
  versionKey: false
})

module.exports = mongoose.model("inscripcion", inscripcion)
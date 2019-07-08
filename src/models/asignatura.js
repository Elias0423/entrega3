const mongoose = require('mongoose')
const Schema = mongoose.Schema

const asignatura = new Schema({
    cedula: {
        type: Number
    },

    idCurso: {
        type: Number
    }
},   
{
  collection: 'asignatura',
  toJSON: { virtuals: true },
  versionKey: false
})

module.exports = mongoose.model("asignatura", asignatura)
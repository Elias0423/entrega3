const fs = require('fs');
const Curso = require('../models/curso')
const Usuario = require('../models/usuario')
const Inscripcion = require('../models/inscripcion')
const Asignatura = require('../models/asignatura')

const verCursos = async (active) => {
  if (active = 1) {
    return await Curso.find({ estado: "Disponible" });
  } else {
    return await Curso.find();
  }
}

const matricularAspirante = async (cedula, curso) => {

  var listaMatriculas = await Inscripcion.find({ cedula: cedula, idCurso: curso });
  let inscripcion = new Inscripcion({
    cedula: cedula,
    idCurso: curso
  });

  if (listaMatriculas.length > 0) {
    return "El aspirante ya se encuentra matriculado en el curso"
  } else {
    await inscripcion.save();
    return "Matricula exitosa"

  }
}

const guardarMatricula = () => {
  let datos = JSON.stringify(listaMatriculas);
  fs.writeFile(__dirname + '/matriculas.json', datos, (err) => {
    if (err) console.log(err);
    console.log("matricula creada")
  });
}

const crearCurso = async (idCurso, nombre, descripcion, valor, modalidad, horas, estado) => {
  var listaCursos = await Curso.find({ idCurso: idCurso });

  let curso = new Curso({
    idCurso: idCurso,
    nombre: nombre,
    descripcion: descripcion,
    valor: valor,
    modalidad: modalidad,
    horas: horas,
    estado: estado
  });
  if (listaCursos.length > 0) {
    return 'El id del curso ya existe'
  } else {
    await curso.save();
    return 'Curso creado exitosamente'
  }
}
const guardarCurso = () => {
  let datos = JSON.stringify(listaCursos);
  fs.writeFile(__dirname + '/cursos.json', datos, (err) => {
    if (err) console.log(err);
    console.log("curso guardado")
  });
}

const cargarInscritos = async () => {
  var listaCursos = await Curso.find({ estado: "Disponible" });
  var listaMatriculas = await Inscripcion.find();

  var datos = []
  for (let i = 0; i < listaCursos.length; i++) {

    var curso = {
      idCurso: listaCursos[i].idCurso,
      nombre: listaCursos[i].nombre,
      aspirantes: []
    }
    for (let j = 0; j < listaMatriculas.length; j++) {
      if (listaMatriculas[j].idCurso == curso.idCurso) {
        curso.aspirantes.push(await Usuario.findOne({ cedula: listaMatriculas[j].cedula }));
      }
    }
    datos.push(curso);
  }
  return datos;
}

const cambiarEstadoCurso = async (cedula, idCurso) => {
  await Curso.findOneAndUpdate({ idCurso: idCurso }, { estado: "Cerrado" })
  var asignatura = new Asignatura({
    cedula: cedula,
    idCurso: idCurso
  })
  var res = await Asignatura.findOne({ cedula: cedula, idCurso: idCurso })
  if (!res) {
    await asignatura.save()
  }
}

const eliminarAspirante = async (cedula, curso) => {
  await Inscripcion.deleteOne({ cedula: cedula, idCurso: curso });
}

const obtenerUsuario = async (cedula) => {
  let user = await Usuario.findOne({ cedula: cedula })

  if (!user) {
    return false;
  } else {
    return user;
  }
}

const actualizarUsuario = async (cedula, nombre, correo, telefono, perfil) => {
  await Usuario.findOneAndUpdate({ cedula: cedula }, { nombre: nombre, correo: correo, telefono: telefono, perfil: perfil });
}

const verMisCursos = async (cedula) => {
  var listaMatriculas = await Inscripcion.find({ cedula: cedula });

  var datos = []
  for (let i = 0; i < listaMatriculas.length; i++) {
    datos.push(await Curso.findOne({ idCurso: listaMatriculas[i].idCurso }));
  }
  return datos;
}

const cursosProfesor = async (cedula) => {
  var listaAsignaturas = await Asignatura.find({ cedula: cedula });

  var datos = []
  for (let i = 0; i < listaAsignaturas.length; i++) {
    datos.push(await Curso.findOne({ idCurso: listaAsignaturas[i].idCurso }));
  }
  return datos;
}

const cargarEstudiantes = async (cedula) => {
  var listaAsignaturas = await Asignatura.find({ cedula: cedula });

  var datos = []
  for (let i = 0; i < listaAsignaturas.length; i++) {
    var datosCurso = await Curso.findOne({ idCurso: listaAsignaturas[i].idCurso });
    var curso = {
      idCurso: datosCurso.idCurso,
      nombre: datosCurso.nombre,
      aspirantes: []
    }
    var listaMatriculas = await Inscripcion.find({ idCurso: curso.idCurso });
    for (let j = 0; j < listaMatriculas.length; j++) {
      curso.aspirantes.push(await Usuario.findOne({ cedula: listaMatriculas[j].cedula }));
    }
    datos.push(curso);
  }
  return datos;
}

const obtenerProfesores = async () => {
  let user = await Usuario.find({ perfil: "Profesor" })
  return user;
}

module.exports = { verCursos, matricularAspirante, crearCurso, cargarInscritos, cambiarEstadoCurso, eliminarAspirante, obtenerUsuario, actualizarUsuario, verMisCursos, cursosProfesor, cargarEstudiantes, obtenerProfesores }
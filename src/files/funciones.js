const fs = require('fs');
listaUsuarios = [];
listaMatriculas = [];
listaCursos = [];
const registrarUsuario = (identificacion, nombre, correo, telefono, rol, pass) => {
  listaUsuarios = require('./usuarios.json');
  let user = {
    identificacion: identificacion,
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    rol: rol,
    pass: pass
  };
  let validacion = listaUsuarios.find(id => id.identificacion == user.identificacion);
  if (!validacion) {
    listaUsuarios.push(user);
    guardarUsuario();
    return 'usuario creado exitosamente'
  } else {
    return 'usuario ya existe'
  }
}
const guardarUsuario = () => {
  let datos = JSON.stringify(listaUsuarios);
  fs.writeFile(__dirname + '/usuarios.json', datos, (err) => {
    if (err) console.log(err);
    console.log("usuario creado")
  });
}

const validarLogin = (identificacion, pass) => {
  listaUsuarios = require('./usuarios.json');
  let encontrado = false
  let user = {}
  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].identificacion == identificacion && listaUsuarios[i].pass == pass) {
      encontrado = true;
      user = listaUsuarios[i];
    }
  }
  if (encontrado == true) {
    return user;
  } else {
    return false;
  }
}

const matricularAspirante = (identificacion, curso) => {
  listaUsuarios = require('./usuarios.json');
  listaMatriculas = require('./matriculas.json');
  let matricula = {
    identificacion: identificacion,
    curso: curso
  }
  let validacion = listaUsuarios.find(id => id.identificacion == identificacion);
  if (!validacion) {
    return "La cedula no esta registrado"
  } else {
    let valMatricula = listaMatriculas.find(est => (est.identificacion == identificacion && est.curso == curso));
    console.log(valMatricula)
    if (!valMatricula) {
      listaMatriculas.push(matricula);
      guardarMatricula();
      return "Matricula exitosa"
    } else {
      return "El aspirante ya se encuentra matriculado en el curso"
    }
  }
}

const guardarMatricula = () => {
  let datos = JSON.stringify(listaMatriculas);
  fs.writeFile(__dirname + '/matriculas.json', datos, (err) => {
    if (err) console.log(err);
    console.log("matricula creada")
  });
}

const crearCurso = (id, nombre, descripcion, valor, modalidad, horas, estado) => {
  listaCursos = require('./cursos.json');
  let curso = {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
    valor: valor,
    modalidad: modalidad,
    horas: horas,
    estado: estado
  };
  let validacion = listaCursos.find(curso => curso.id == id);
  if (!validacion) {
    listaCursos.push(curso);
    guardarCurso();
    return 'Curso creado exitosamente'
  } else {
    return 'El id del curso ya existe'
  }
}
const guardarCurso = () => {
  let datos = JSON.stringify(listaCursos);
  fs.writeFile(__dirname + '/cursos.json', datos, (err) => {
    if (err) console.log(err);
    console.log("curso guardado")
  });
}

const cargarInscritos = () => {
  listaCursos = require('./cursos.json');
  listaMatriculas = require('./matriculas.json');
  listaUsuarios = require('./usuarios.json');

  var datos = []
  for (let i = 0; i < listaCursos.length; i++) {
    if (listaCursos[i].estado == 1) {
      var curso = {
        id: listaCursos[i].id,
        nombre: listaCursos[i].nombre,
        aspirantes: []
      }
      for (let j = 0; j < listaMatriculas.length; j++) {
        if (listaMatriculas[j].curso == curso.id) {
          curso.aspirantes.push(listaUsuarios.find(user => user.identificacion == listaMatriculas[j].identificacion));
        }
      }
      datos.push(curso);
    }
  }
  return datos;
}

const cambiarEstadoCurso = (id) => {
  listaCursos = require('./cursos.json');
  let curso = listaCursos.find(curso => curso.id == id);
  curso.estado = 0;
  for (let i = 0; i < listaCursos.length; i++) {
    if (listaCursos[i].id == curso.id) {
      listaCursos[i] = curso;
    }
  }
  guardarCurso();
}

const eliminarAspirante = (identificacion, curso) => {
  listaMatriculas = require('./matriculas.json');

  for (let i = 0; i < listaMatriculas.length; i++) {
    if (listaMatriculas[i].identificacion == identificacion && listaMatriculas[i].curso == curso) {
      listaMatriculas.splice(i, 1)
    }
  }
  guardarMatricula();
}

const obtenerUsuario = (identificacion) => {
  listaUsuarios = require('./usuarios.json');
  let user = listaUsuarios.find(usuario => usuario.identificacion == identificacion);
  if (!user) {
    return false;
  } else {
    return user;
  }
}

const actualizarUsuario = (identificacion, nombre, correo, telefono, rol) => {
  listaUsuarios = require('./usuarios.json');

  var user = listaUsuarios.find(usuario => usuario.identificacion == identificacion);
  user = {
    identificacion: identificacion,
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    rol: rol,
    pass: user.pass
  }
  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].identificacion == identificacion) {
      listaUsuarios[i] = user
    }
  }
  guardarUsuario();
}

const verMisCursos = (identificacion) => {
  listaCursos = require('./cursos.json');
  listaMatriculas = require('./matriculas.json');

  var datos = []
  for (let i = 0; i < listaMatriculas.length; i++) {
    if (listaMatriculas[i].identificacion == identificacion) {
      datos.push(listaCursos.find(curso => curso.id == listaMatriculas[i].curso));
    }
  }
  return datos;
}

module.exports = { registrarUsuario, validarLogin, matricularAspirante, crearCurso, cargarInscritos, cambiarEstadoCurso, eliminarAspirante, obtenerUsuario, actualizarUsuario, verMisCursos }
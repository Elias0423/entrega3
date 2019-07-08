const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const funciones = require('../files/funciones');
const dirViews = path.join(__dirname, '../../templates/views/');
const directoriopartials = path.join(__dirname, '../../templates/partials');

const Curso = require('../models/curso')
const Usuario = require('../models/usuario')
const Inscripcion = require('../models/inscripcion')

require('../helpers/helpers')


app.set('views', dirViews)
app.set('view engine', 'hbs');
hbs.registerPartials(directoriopartials);

//RUTAS TODOS ------------------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/registrarusuario', (req, res) => {
  let usuario = new Usuario({
    cedula: req.body.cedula,
    nombre: req.body.nombre,
    password: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
    telefono: req.body.telefono,
    perfil: req.body.perfil
  })

  usuario.save((err, result) => {
    if (err) {
      res.render('index', {
        message: err
      })
    }
    res.render('index', {
      message: "Usuario creado exitosamente"
    })
  })
})

app.post('/iniciarsesion', (req, res) => {
  Usuario.findOne({ cedula: req.body.cedula }, async (err, user) => {
    if (err) {
      res.render('index', {
        message: err
      })
    }
    if (!user) {
      res.render('index', {
        message: 'Cédula o contraseña incorrecta'
      })
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.render('index', {
        message: 'Cédula o contraseña incorrecta'
      })
    }

    req.session.nombre = user.nombre
    req.session.cedula = user.cedula

    if (user.perfil == 'Aspirante') {
      var result = await funciones.verCursos(1);

      res.render('vercursosactivos', {
        nombre: req.session.nombre,
        listadoCursos: result
      });
    } else if (user.perfil == 'Profesor') {
      var cursos = await funciones.cursosProfesor(req.session.cedula);
      var estudiantes = await funciones.cargarEstudiantes(req.session.cedula);
      res.render('cursosprofesor', {
        cedula: req.session.cedula,
        nombre: req.session.nombre,
        misCursos: cursos,
        inscritos: estudiantes
      });
    } else if (user.perfil == 'Coordinador') {
      var result = await funciones.verCursos(0);
      res.render('vercursos', {
        nombre: req.session.nombre,
        listadoCursos: result
      });
    } else {
      return res.render('index', {
        message: 'No tiene un perfil valido'
      })
    }
  })
})

//RUTAS ASPIRANTE --------------------------------------------------------------------------

app.get('/vercursosactivos', async (req, res) => {
  var result = await funciones.verCursos(1);

  res.render('vercursosactivos', {
    nombre: req.session.nombre,
    listadoCursos: result
  });

});

app.get('/matricular', async (req, res) => {
  var result = await funciones.verCursos(1)
  res.render('matricular', {
    nombre: req.session.nombre,
    listadoCursos: result
  });
});

app.post('/matricular', async (req, res) => {
  var mensaje = await funciones.matricularAspirante(req.session.cedula, req.body.curso);
  var result = await funciones.verCursos(1)
  return res.render('matricular', {
    message: mensaje,
    nombre: req.session.nombre,
    listadoCursos: result
  });
});

app.get('/miscursos', async (req, res) => {
  var cursos = await funciones.verMisCursos(req.session.cedula);
  res.render('miscursos', {
    cedula: req.session.cedula,
    nombre: req.session.nombre,
    misCursos: cursos
  });
});

app.post('/cancelarinscripcion', async (req, res) => {
  await funciones.eliminarAspirante(req.session.cedula, req.body.curso);
  var cursos = await funciones.verMisCursos(req.session.cedula);
  return res.render('miscursos', {
    cedula: req.session.cedula,
    nombre: req.session.nombre,
    misCursos: cursos,
    message: "Cancelacion exitosa"
  });
});

//RUTAS COORDINADOR --------------------------------------------------------------------------------

app.get('/crearcursos', (req, res) => {
  res.render('crearcursos', {
    nombre: req.session.nombre
  });
});

app.post('/crearcursos', async (req, res) => {
  var mensaje = await funciones.crearCurso(Number(req.body.id), req.body.nombre, req.body.descripcion, Number(req.body.valor), req.body.modalidad, Number(req.body.horas), "Disponible")
  console.log(mensaje)
  return res.render('crearcursos', {
    message: mensaje,
    nombre: req.session.nombre
  });
});

app.get('/vercursos', async (req, res) => {
  var result = await funciones.verCursos(0);
  res.render('vercursos', {
    nombre: req.session.nombre,
    listadoCursos: result
  });
});

app.get('/inscritos', async (req, res) => {
  var inscritos = await funciones.cargarInscritos();
  var result = await funciones.verCursos(0);
  res.render('inscritos', {
    nombre: req.session.nombre,
    inscritos: inscritos,
    listadoCursos: result
  });
});

app.post('/cambiarestado', async (req, res) => {
  await funciones.cambiarEstadoCurso(req.body.curso)
  var inscritos = await funciones.cargarInscritos();
  var result = await funciones.verCursos(0);
  return res.render('inscritos', {
    nombre: req.session.nombre,
    message: "Estado del curso cambiado a cerrado",
    inscritos: inscritos,
    listadoCursos: result
  });
});

app.get('/eliminaraspirantes', async (req, res) => {
  var result = await funciones.verCursos(1);
  res.render('eliminaraspirantes', {
    nombre: req.session.nombre,
    listadoCursos: result
  });
});

app.post('/eliminaraspirantes', async (req, res) => {

  await funciones.eliminarAspirante(req.body.cedula, req.body.curso);
  var inscritos = await funciones.cargarInscritos();
  return res.render('verinscritos', {
    nombre: req.session.nombre,
    message: "Aspirante eliminado exitosamente",
    curso: req.body.curso,
    inscritos: inscritos
  });
});


app.get('/actualizar', (req, res) => {
  res.render('actualizar', {
    nombre: req.session.nombre
  });
});

app.post('/actualizar', async (req, res) => {
  var user = await funciones.obtenerUsuario(req.body.cedula);
  if (user == false) {
    return res.render('actualizar', {
      message: "No se encontró el usuario"
    });
  } else {
    res.render('actualizarusuario', {
      cedula: user.cedula,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      perfil: user.perfil
    });
  }
});


app.post('/actualizarusuario', async (req, res) => {
  await funciones.actualizarUsuario(Number(req.body.cedula), req.body.nombre, req.body.correo, req.body.telefono, req.body.perfil);
  var user = await funciones.obtenerUsuario(req.body.cedula);
  return res.render('actualizarusuario', {
    cedula: user.cedula,
    nombre: user.nombre,
    correo: user.correo,
    telefono: user.telefono,
    perfil: user.perfil,
    message: "Informacion actualizada correctamente"
  });
});

//RUTAS PROFESOR -------------------------------------------------------------------------------------------

app.get('/cursosprofesor', async (req, res) => {
  var cursos = await funciones.cursosProfesor(req.session.cedula);
  var estudiantes = await funciones.cargarEstudiantes(req.session.cedula);
  res.render('cursosprofesor', {
    cedula: req.session.cedula,
    nombre: req.session.nombre,
    misCursos: cursos,
    inscritos: estudiantes
  });
});


app.get('/salir', (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err)
  })
  res.redirect('/')
})

app.get('*', (req, res) => {
  res.render('error');
})

module.exports = app
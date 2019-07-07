const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('../files/funciones');
const dirViews = path.join(__dirname, '../../templates/views/');
const directoriopartials = path.join(__dirname, '../../templates/partials');

require('../helpers/helpers')


app.set('views', dirViews)
app.set('view engine', 'hbs');
hbs.registerPartials(directoriopartials);

//RUTAS TODOS ------------------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/registrarusuario', (req, res) => {
  var response = funciones.registrarUsuario(req.body.identificacion, req.body.nombre, req.body.correo, req.body.telefono, 1, req.body.pass)
  return res.render('index', {
    message: response
  });
});

app.post('/iniciarsesion', (req, res) => {
  var user = funciones.validarLogin(req.body.identificacion, req.body.pass);
  if (user != false) {
    req.session.identificacion = user.identificacion;
    req.session.nombre = user.nombre + " ";
    if (user.rol == 1) {
      res.render('vercursosactivos', {
        nombre: req.session.nombre
      });
    } else {
      res.render('vercursos', {
        nombre: req.session.nombre
      });
    }
  } else {
    res.render('index', {
      message: "El usuario no existe actualmente"
    })
  }
});

//RUTAS ASPIRANTE --------------------------------------------------------------------------

app.get('/vercursosactivos', (req, res) => {
  res.render('vercursosactivos', {
    nombre: req.session.nombre
  });
});

app.get('/matricular', (req, res) => {
  res.render('matricular', {
    nombre: req.session.nombre
  });
});

app.post('/matricular', (req, res) => {
  var mensaje = funciones.matricularAspirante(req.session.identificacion, req.body.curso);
  return res.render('matricular', {
    message: mensaje,
    nombre: req.session.nombre
  });
});


app.get('/miscursos', (req, res) => {
  res.render('miscursos', {
    identificacion: req.session.identificacion,
    nombre: req.session.nombre
  });
});

app.post('/cancelarinscripcion', (req, res) => {
  funciones.eliminarAspirante(req.session.identificacion, req.body.curso);
  return res.render('miscursos', {
    identificacion: req.session.identificacion,
    nombre: req.session.nombre,
    message: "Cancelacion exitosa"
  });
});

//RUTAS COORDINADOR --------------------------------------------------------------------------------

app.get('/crearcursos', (req, res) => {
  res.render('crearcursos', {
    nombre: req.session.nombre
  });
});

app.post('/crearcursos', (req, res) => {
  var mensaje = funciones.crearCurso(Number(req.body.id), req.body.nombre, req.body.descripcion, Number(req.body.valor), Number(req.body.modalidad), Number(req.body.horas), 1)

  return res.render('crearcursos', {
    message: mensaje,
    nombre: req.session.nombre
  });
});

app.get('/vercursos', (req, res) => {
  res.render('vercursos', {
    nombre: req.session.nombre
  });
});

app.get('/inscritos', (req, res) => {
  res.render('inscritos', {
    nombre: req.session.nombre
  });
});

app.post('/cambiarestado', (req, res) => {
  funciones.cambiarEstadoCurso(req.body.curso)
  return res.render('inscritos', {
    nombre: req.session.nombre,
    message: "Estado del curso cambiado a cerrado"
  });
});

app.get('/eliminaraspirantes', (req, res) => {
  res.render('eliminaraspirantes', {
    nombre: req.session.nombre
  });
});

app.post('/eliminaraspirantes', (req, res) => {
  funciones.eliminarAspirante(req.body.identificacion, req.body.curso);
  return res.render('verinscritos', {
    nombre: req.session.nombre,
    message: "Aspirante eliminado exitosamente",
    curso: req.body.curso
  });
});


app.get('/actualizar', (req, res) => {
  res.render('actualizar', {
    nombre: req.session.nombre
  });
});

app.post('/actualizar', (req, res) => {
  var user = funciones.obtenerUsuario(req.body.identificacion);
  if (user == false) {
    return res.render('actualizar', {
      message: "No se encontró el usuario"
    });
  } else {
    res.render('actualizarusuario', {
      identificacion: user.identificacion,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol
    });
  }
});


app.post('/actualizarusuario', (req, res) => {
  funciones.actualizarUsuario(Number(req.body.identificacion), req.body.nombre, req.body.correo, req.body.telefono, Number(req.body.rol));
  var user = funciones.obtenerUsuario(req.body.identificacion);
  return res.render('actualizarusuario', {
    identificacion: user.identificacion,
    nombre: user.nombre,
    correo: user.correo,
    telefono: user.telefono,
    rol: user.rol,
    message: "Informacion actualizada correctamente"
  });
});

//RUTAS PROFESOR -------------------------------------------------------------------------------------------

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
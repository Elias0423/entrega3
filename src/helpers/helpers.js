const hbs = require('hbs');
const funciones = require('../files/funciones');

hbs.registerHelper('registroUsuario', (identificacion, nombre, correo, telefono, rol, pass) => {

  var res = funciones.registrarUsuario(identificacion, nombre, correo, telefono, rol, pass);
  return "<h4>" + res + "</h4>"

});

hbs.registerHelper('listar', () => {
  listarEstudiantes = require('../listado.json');
  let texto = "<table class='table table-striped'> \
    <thead class='thead-dark'>\
      <th>Nombre</th>\
      <th>Matematicas</th>\
      <th>Ingles</th>\
      <th>Programación</th>\
    </thead>\
    <tbody>";

  listarEstudiantes.forEach(estudiante => {
    texto = texto + '<tr>' +
      "<td>" + estudiante.nombre + '</td>' +
      "<td>" + estudiante.matematicas + '</td>' +
      "<td>" + estudiante.ingles + '</td>' +
      "<td>" + estudiante.programacion + '</td>' +
      '</tr>';
  });
  texto = texto + '</tbody> </table>'
  return texto;
})

hbs.registerHelper('verCursosActivos', () => {
  listadoCursos = require('../files/cursos');
  let texto = '<div class="accordion" id="accordionExample"> \
    <div class="row"> ';
  let i = 1;
  listadoCursos.forEach(curso => {
    if (curso.estado == 1) {
      texto = ` ${texto} 
      <div class="col-sm-4">
            <div class="card sm-6 text-center">
              <div class="card-header" id="heading${i}">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    ID: ${curso.id} <br> Nombre: ${curso.nombre} <br> descripcion: ${curso.descripcion} <br> valor: ${curso.valor}
                  </button>
              </div>

              <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                  Descripcion: ${curso.descripcion} <br>
                  Modalidad: ${curso.modalidad == 1 ? "Virtual" : "Presencial"} <br>
                  Intensidad Horaria: ${curso.horas} <br>
                </div>
              </div> 
            </div> 
            </div> `
      i = i + 1;
    }
  });
  texto = texto + '  </div>  </div>'

  return texto;
})

hbs.registerHelper('verCursos', () => {
  listadoCursos = require('../files/cursos');
  let texto = '<div class="accordion" id="accordionExample"> \
    <div class="row"> ';
  let i = 1;
  listadoCursos.forEach(curso => {
    texto = ` ${texto} 
      <div class="col-sm-4">
            <div class="card sm-6 text-center">
              <div class="card-header" id="heading${i}">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                  ID: ${curso.id} <br> Nombre: ${curso.nombre} <br> descripcion: ${curso.descripcion} <br> valor: ${curso.valor}
                  </button>
              </div>

              <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                  Descripcion: ${curso.descripcion} <br>
                  Modalidad: ${curso.modalidad == 1 ? "Virtual" : "Presencial"} <br>
                  Intensidad Horaria: ${curso.horas} <br>
                  Estado: ${curso.estado == 1 ? "Disponible" : "Cerrado"}
                </div>
              </div> 
            </div> 
            </div> `
    i = i + 1;
  });
  texto = texto + '  </div>  </div>'

  return texto;
})

hbs.registerHelper('listarCursos', () => {
  listadoCursos = require('../files/cursos');
  let texto = '';

  listadoCursos.forEach(curso => {
    if (curso.estado == 1) {
      texto = ` ${texto} <option value="${curso.id}">${curso.nombre}</option> `
    }
  });

  return texto;
})

hbs.registerHelper('verInscritos', () => {
  var info = funciones.cargarInscritos();
  let texto = ""

  info.forEach(datos => {
    texto = texto + "Curso: " + datos.nombre + "<br>\
      <table class='table table-striped'> \
      <thead class='thead-dark'>\
        <th>Identificación aspirante</th>\
        <th>Nombre aspirante</th>\
        <th>Correo aspirante</th>\
        <th>telefono aspirante</th>\
      </thead>\
      <tbody>";
    if (datos.aspirantes != undefined) {
      datos.aspirantes.forEach(estudiante => {
        texto = texto + '<tr>' +
          "<td>" + estudiante.identificacion + '</td>' +
          "<td>" + estudiante.nombre + '</td>' +
          "<td>" + estudiante.correo + '</td>' +
          "<td>" + estudiante.telefono + '</td>' +
          '</tr>';
      })
    }
    texto = texto + '</tbody> </table>'
  });
  return texto;
})

hbs.registerHelper('verInscritosCurso', (id) => {
  var info = funciones.cargarInscritos();
  let texto = ""

  info.forEach(datos => {
    if (datos.id == id) {
      texto = texto + "Aspirantes del curso: <strong>" + datos.nombre + "</strong> despues de eliminar<br>\
        <table class='table table-striped'> \
        <thead class='thead-dark'>\
          <th>Identificación aspirante</th>\
          <th>Nombre aspirante</th>\
          <th>Correo aspirante</th>\
          <th>telefono aspirante</th>\
        </thead>\
        <tbody>";
      if (datos.aspirantes != undefined) {
        datos.aspirantes.forEach(estudiante => {
          texto = texto + '<tr>' +
            "<td>" + estudiante.identificacion + '</td>' +
            "<td>" + estudiante.nombre + '</td>' +
            "<td>" + estudiante.correo + '</td>' +
            "<td>" + estudiante.telefono + '</td>' +
            '</tr>';
        })
      }
      texto = texto + '</tbody> </table>'
    }

  });
  return texto;
})

hbs.registerHelper('listarRol', (rol) => {
  let texto = "";
  if (rol == 1) {
    texto = `${texto} <option selected value="1">Aspirante</option>
            <option value="2">Profesor</option>`
  } else {
    texto = `${texto} <option value="1">Aspirante</option>
            <option selected value="2">Profesor</option>`
  }
  return texto;
})

hbs.registerHelper('verMisCursos', (identificacion) => {
  var info = funciones.verMisCursos(identificacion);
  let texto = "<table class='table table-striped'> \
        <thead class='thead-dark'>\
          <th>ID Curso</th>\
          <th>Nombre curso</th>\
          <th>Descripcion Curso</th>\
        </thead>\
        <tbody>";
  info.forEach(datos => {
    texto = texto + '<tr>' +
      "<td>" + datos.id + '</td>' +
      "<td>" + datos.nombre + '</td>' +
      "<td>" + datos.descripcion + '</td>' +
      '</tr>';
  });
  texto = texto + '</tbody> </table>'
  return texto;
})

hbs.registerHelper('listarMisCursos', (identificacion) => {
  var cursos = funciones.verMisCursos(identificacion);
  let texto = '';

  cursos.forEach(curso => {
    texto = ` ${texto} <option value="${curso.id}">${curso.nombre}</option> `
  });

  return texto;
})
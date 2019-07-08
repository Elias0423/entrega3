const hbs = require('hbs');

hbs.registerHelper('verCursos', (listadoCursos, perfil) => {
  let texto = '<div class="accordion" id="accordionExample"> \
    <div class="row"> ';
  let i = 1;
  listadoCursos.forEach(curso => {
    texto = ` ${texto} 
      <div class="col-sm-4">
            <div class="card sm-6 text-center">
              <div class="card-header" id="heading${i}">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    ID: ${curso.idCurso} <br> Nombre: ${curso.nombre} <br> descripcion: ${curso.descripcion} <br> valor: ${curso.valor}
                  </button>
              </div>

              <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                  Descripcion: ${curso.descripcion} <br>
                  Modalidad: ${curso.modalidad} <br>
                  Intensidad Horaria: ${curso.horas} <br> `
      if(perfil == "Coordinador"){
        texto = ` ${texto} Estado: ${curso.estado} <br> `
      }
      texto = ` ${texto} 
                </div>
              </div> 
            </div> 
            </div> `
    i = i + 1;
  });
  texto = texto + '  </div>  </div>'
  return texto;
})

hbs.registerHelper('listarCursos', (listadoCursos) => {
  let texto = '';
  listadoCursos.forEach(curso => {
    texto = ` ${texto} <option value="${curso.idCurso}">${curso.nombre}</option> `
  });
  return texto;
})

hbs.registerHelper('verInscritos', (info) => {
  
  let texto = ""

  info.forEach(datos => {
    texto = texto + "Curso: <strong> " + datos.nombre + " </strong> <br>\
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
          "<td>" + estudiante.cedula + '</td>' +
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

hbs.registerHelper('verInscritosCurso', (info, idCurso) => {
  let texto = ""

  info.forEach(datos => {
    if (datos.idCurso == idCurso) {
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
            "<td>" + estudiante.cedula + '</td>' +
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
  if (rol == "Aspirante") {
    texto = `${texto} <option selected value="Aspirante">Aspirante</option>
            <option value="Profesor">Profesor</option>`
  } else {
    texto = `${texto} <option value="Aspirante">Aspirante</option>
            <option selected value="Profesor">Profesor</option>`
  }
  return texto;
})

hbs.registerHelper('verMisCursos', (info) => {
  
  let texto = "<table class='table table-striped'> \
        <thead class='thead-dark'>\
          <th>ID Curso</th>\
          <th>Nombre curso</th>\
          <th>Descripcion Curso</th>\
        </thead>\
        <tbody>";
  for (let i = 0; i < info.length; i++) {
    const datos = info[i];
    texto = texto + '<tr>' +
      "<td>" + datos.idCurso + '</td>' +
      "<td>" + datos.nombre + '</td>' +
      "<td>" + datos.descripcion + '</td>' +
      '</tr>';
  }
  texto = texto + '</tbody> </table>'
  return texto;
})

hbs.registerHelper('listarProfesores', (listadoProfesores) => {
  let texto = '';

  listadoProfesores.forEach(profe => {
    texto = ` ${texto} <option value="${profe.cedula}">${profe.nombre}</option> `
  });

  return texto;
})
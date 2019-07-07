require('./config/config')
const express = require('express');
const app = express();
var session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
var MemoryStore = require('memorystore')(session);
const mongoose = require('mongoose')

//Paths
const dirNodeModules = path.join(__dirname, '../node_modules');
const directoriopublico = path.join(__dirname, '../public');

//Static
app.use('/css', express.static(dirNodeModules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNodeModules + '/jquery/dist'));
app.use('/js', express.static(dirNodeModules + '/popper.js/dist'));
app.use('/js', express.static(dirNodeModules + '/bootstrap/dist/js'));
app.use(express.static(directoriopublico));



//### Para usar las variables de sesión
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

app.use((req, res, next) =>{
	//En caso de usar variables de sesión
	if(req.session.usuario){		
		res.locals.sesion = true
	}	
	next()
})

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//Routes
app.use(require('./routes/index'));

mongoose.connect('mongodb://localhost:27017/appcursos', {useNewUrlParser: true}, (err, result) => {
	if(err) throw err
	console.log("Conectado a la base de datos")
})

app.listen(process.env.PORT, () => {
  console.log("Server en puerto " + process.env.PORT)
})
/*
Rutas de Usuarios /Auth
host + /api/auth
*/

const express = require('express');
require('dotenv').config()
const cors = require('cors')
const { dbConnection } = require('./database/config');
// console.log(process.env)
//crear el servidor de express
const app = express();


//base de datos
dbConnection();

//cors
app.use(cors())

// directorio publico
app.use(express.static('public'));

//lectura  y parseo del body
app.use(express.json());

//rutas
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));
// auth crear, login renew

app.get('*',(req,res)=>{
  res.sendFile(__dirname+'/public/index.html')
})
//crud: evenetos


// escuchar peticion 
app.listen(process.env.PORT,()=>{
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})
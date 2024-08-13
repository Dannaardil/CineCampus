const express  = require("express");
const peliculas = require("./server/module/peliculas.js");
const appPeliculas = require("./server/routes/peliculas.routes.js");
const appTicket = require("./server/routes/boletos.routes.js")
const appPayments = require("./server/routes/pagos.routes.js");
const appSeats = require("./server/routes/asientos.routes.js");
const appUsers = require("./server/routes/usuarios.routes.js");

const app = express();


const { body, validationResult } = require('express-validator');
const path = require('path');
const cors = require('cors');





app.use(cors());
app.use(express.json());
app.use(express.static(process.env.EXPRESS_STATIC))



app.use("/api/movies", appPeliculas);

app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/home.html'));
  });


app.use('/seats/', appSeats)

app.use('/', appPayments);

app.use('/', appTicket)

app.use('/', appUsers)


app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})
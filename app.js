const express  = require("express");
const { default: peliculas } = require("./server/module/peliculas.js");
const appPeliculas = require("./server/routes/peliculas.routes.js");
const appSeats = require("./server/routes/asientos.routes.js");
const app = express();

app.use(express.static(process.env.EXPRESS_STATIC))

app.use(express.json());


app.use("/movies", appPeliculas)


app.use('/movies/', appPeliculas)

app.use('/seats/', appSeats)


app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})
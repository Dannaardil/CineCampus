const express  = require("express");
const { default: peliculas } = require("./js/model/peliculas");
const MovieService = require("./js/model/peliculas.js")

const app = express();



app.get("/peliculas",async(req, res)=>{
    let peliculasDisp = new MovieService();
    res.status(200).send(await peliculasDisp.getAllMovies())
} )


app.get("/peliculas/:id", async(req, res)=>{
    let peliculaById = new MovieService();
    res.status(200).send(await peliculaById.getMovieById(req.params.id))
})

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})
const pelicula = require('../module/peliculas.js')

const express = require('express')

const appPeliculas = express.Router()


appPeliculas.get('/v1', async(req,res)=>{
    let peliculasDisp = new pelicula();
    res.send(await peliculasDisp.getAllMovies())
})

module.exports = appPeliculas
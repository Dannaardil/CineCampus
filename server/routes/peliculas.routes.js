const pelicula = require('../module/peliculas.js')

const express = require('express')

const appPeliculas = express.Router()


appPeliculas.get('/v1', async(req,res)=>{
    let peliculasDisp = new pelicula();
    res.send(await peliculasDisp.getAllMovies())
})

appPeliculas.get('/:id', async(req, res)=>{
    let movieById = new pelicula();
    res.send(await movieById.getMovieById(req.params))
})

module.exports = appPeliculas
const express  = require("express");
const { default: peliculas } = require("./js/model/peliculas");

const app = express();



app.get("/peliculas",async(req, res)=>{
    let peliculasDisp = new MovieService();
    res.status(200).send(await peliculasDisp.getAllMovies())
} )
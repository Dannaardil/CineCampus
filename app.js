const express  = require("express");
const { default: peliculas } = require("./server/module/peliculas.js");
const appPeliculas = require("./server/routes/peliculas.routes.js");

const app = express();

app.use(express.static(process.env.EXPRESS_STATIC))

app.get("/movies",async(req, res)=>{
 
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/pelicula.html`, {root: __dirname})
} )


app.use("/movies", appPeliculas)
// app.get("/peliculas/:id", async(req, res)=>{
//     let peliculaById = new MovieService();
//     res.status(200).send(await peliculaById.getMovieById(req.params))
// })

app.use('/movies/:id', appPeliculas)

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})
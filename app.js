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
  app.get('/movie/:id', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/peliculas.html'));
  });

 


app.use('/seats/', appSeats)
app.get('/seat/:projectionId', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views/asientos.html'));
});
app.get('/api/seats', async (req, res) => {
  try {
      const seatsService = new SeatsService();
      const allSeats = await seatsService.getAllSeats();
      res.json(allSeats);
  } catch (error) {
      console.error('Error fetching all seats:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});
app.get('/api/projections/:movieId', async (req, res) => {
  try {
      const projectionsService = new ProjectionsService();
      const projections = await projectionsService.getProjectionsForMovie(req.params.movieId, req.query.date);
      res.json(projections);
  } catch (error) {
      console.error('Error fetching projections:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.use('/pay/', appPayments);
app.get('/all/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views/pagos.html'));
});

app.use('/', appTicket)

app.use('/', appUsers)

app.get('/bTicket/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views/buyedTicket.html'));
});

app.get('/ticket/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views/ticket.html'));
});

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT},()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
})
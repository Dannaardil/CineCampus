


const MovieService = require('../module/peliculas.js');
const express = require('express');
const appPeliculas = express.Router();

appPeliculas.get('/v1', async (req, res) => {
  try {
    let peliculasDisp = new MovieService();
    const movies = await peliculasDisp.getAllMovies();
    res.send(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
appPeliculas.get('/v2', async (req, res) => {
  try {
    let peliculasDisp = new MovieService();
    const movies = await peliculasDisp.getUpcomingMovies();
    res.send(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

appPeliculas.get('/:id', async (req, res) => {
  try {
    let movieService = new MovieService();
    const movie = await movieService.getMovieById({ id: req.params.id });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error in getMovieById route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = appPeliculas;
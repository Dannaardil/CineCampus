const projectionsService = require('../module/proyecciones.js');
const express = require('express');
const appSeats = express.Router();
// Route for verifying seats
appSeats.get('/:proyeccionId', async (req, res) => {
try {
const seatsService = new projectionsService(); // Instantiate the service
const seatsA = await seatsService.getAvailableSeats({ proyeccionId: req.params.proyeccionId });
if (seatsA) {
res.send(seatsA);
 } else {
res.status(404).send({ error: 'Projection or seats not found' });
 }
 } catch (error) {
console.error('Error in getAvailableSeats route:', error);
res.status(500).send({ error: 'Internal Server Error' });
 }
});
appSeats.get('/all/:proyeccionId', async (req, res) => {
try {
const seatsService = new projectionsService(); // Instantiate the service
const seatsA = await seatsService.getAllSeats({ proyeccionId: req.params.proyeccionId });
if (seatsA) {
res.send(seatsA);
 } else {
res.status(404).send({ error: 'Projection or seats not found' });
 }
 } catch (error) {
console.error('Error in getAvailableSeats route:', error);
res.status(500).send({ error: 'Internal Server Error' });
 }
});
appSeats.get('/withAvailability/:movieId', async (req, res) => {
  try {
    const seatsService = new projectionsService();
    const seatsWithAvailability = await seatsService.getAllSeatsWithAvailability({ movieId: req.params.movieId });
    if (seatsWithAvailability && seatsWithAvailability.length > 0) {
      res.send(seatsWithAvailability);
    } else {
      res.status(404).send({ error: 'No projections or seats found for this movie' });
    }
  } catch (error) {
    console.error('Error in getAllSeatsWithAvailability route:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
appSeats.get('/api/seats/', async (req, res) => {
try {
const seatsService = new projectionsService();
const allSeats = await seatsService.getAvailableSeats(req.params.proyeccionId);
res.json(allSeats);
 } catch (error) {
console.error('Error fetching all seats:', error);
res.status(500).send({ error: 'Internal Server Error' });
 }
});
appSeats.get('/api/projections/:movieId', async (req, res) => {
  try {
    const projectionsservice = new projectionsService();
    const obecto = { movieId : req.params.movieId }
    const projections = await projectionsservice.getProjectionById(obecto);
  res.send(projections);
  } catch (error) {
    console.error('Error fetching projections:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
  });
  appSeats.get('/api/projections/week/:movieId', async (req, res) => {
    try {
        const projectionsservice = new projectionsService();
        const projections = await projectionsservice.getProjectionsForWeek(req.params.movieId);
        if (projections.length === 0) {
            console.log('No projections found for movie ID:', req.params.movieId);
            return res.status(404).send({ message: 'No projections available for this movie' });
        }
        res.send(projections);
    } catch (error) {
        console.error('Error fetching projections for week:', error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
});

appSeats.get('/api/sala/:salaId', async (req, res) => {
    try {
        const projectionsservice = new projectionsService();
        const salaDetails = await projectionsservice.getSalaDetails(req.params.salaId);
        res.send(salaDetails);
    } catch (error) {
        console.error('Error fetching sala details:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
module.exports = appSeats;

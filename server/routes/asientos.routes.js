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
module.exports = appSeats;

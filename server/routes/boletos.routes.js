const express = require('express');
const TicketService = require('../module/boletos.js'); // Import the payService

const appTicket = express.Router();

appTicket.post('/setTicket', async (req, res) => {
  try {
    const { proyeccion_id, usuario_id, asiento, metodo_pago } = req.body;
    const Ticket = new TicketService();
    const result = await Ticket.setTicket({ proyeccion_id, usuario_id, asiento, metodo_pago });

    // Handle the payment result
  
      res.status(200).json({ message: result });
  
     
    
  } catch (error) {
    console.error('Error in payment route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// ... other routes (unchanged)

appTicket.patch('/cancel/:id', async (req, res) => {
  try {
    const Ticket = new TicketService(); // Instantiate the service
    const result = await Ticket.cancelAReservation({ id: req.params.id });
    if (result) {
      res.status(200).json(result); // Send the response object
    } else {
      res.status(404).json({ error: 'Boleto no encontrado' }); // Specific error message
    }
  } catch (error) {
    console.error('Error in cancel a reservation route:', error);
    res.status(500).json({ error: 'Error interno del servidor' }); // User-friendly error message
  }
});


appTicket.patch('cancel/:id', async (req, res) => {
    try {
      const Ticket = new TicketService(); // Instantiate the service
      const ticket1 = await Ticket.cancelAReservation({ id: req.params.id });
  
      if (ticket1) {
        res.send(ticket1);
      } else {
        res.status(404).send({ error: 'not found' });
      }
    } catch (error) {
      console.error('Error in cance a reservation  route:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });


// body (setTicket) = {
//     "proyeccion_id": 2,
//     "usuario_id": 2, 
//     "asiento": {
//         "fila": "C",
//        "numero": 2,
//        "tipo": "vip"
//     },
//     "metodo_pago": "tarjeta"
// }

module.exports = appTicket;
const express = require('express');
const PayService = require('../module/pagos.js');

const appPayments = express.Router();

appPayments.post('/payment', async (req, res) => {
  try {
    // Destructure and validate the request body
    const { proyeccion_id, usuario_id, asiento, metodo_pago, precio } = req.body;
    
    if (!proyeccion_id || !asiento || !metodo_pago || !usuario_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create an instance of the PayService
    const paymentService = new PayService();
    
    // Call the payOnline method and await its result
    const result = await paymentService.payOnline({ proyeccion_id, usuario_id, asiento, metodo_pago, precio });
    
    // Send success response if payment was processed successfully
    res.json({ message: result.message });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in payment route:', error);
    
    // Send error response with a 500 status code
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = appPayments;

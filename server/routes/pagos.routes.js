const express = require('express');
const payService = require('../module/pagos.js'); // Import the payService

const appPayments = express.Router();

appPayments.post('/payment', async (req, res) => {
  try {
    const { proyeccion_id, usuario_id, asiento, metodo_pago } = req.body;
    const paymentService = new payService();
    const result = await paymentService.payOnline({ proyeccion_id, usuario_id, asiento, metodo_pago });

    // Handle the payment result
  
      res.status(200).json({ message: result });
  
     
    
  } catch (error) {
    console.error('Error in payment route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// body = {
//     "proyeccion_id": 2,
//     "usuario_id": 2, 
//     "asiento": {
//         "fila": "C",
//        "numero": 2,
//        "tipo": "vip"
//     },
//     "metodo_pago": "tarjeta"
// }

module.exports = appPayments;

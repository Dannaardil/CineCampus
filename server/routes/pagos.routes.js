const express = require('express');
const payService = require('../module/pagos.js');

const appPayments = express.Router();


appPayments.post('/payment', async (req, res) => {
  try {
    const { proyeccion_id, usuario_id, asiento, metodo_pago, precio } = req.body;
    
    if (!proyeccion_id || !asiento || !metodo_pago  || !usuario_id ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

   

    //

 
    const paymentService = new payService();
    const result = await paymentService.payOnline({ proyeccion_id, usuario_id, asiento, metodo_pago, precio });
    
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error in payment route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = appPayments;

const express = require('express');
const payService = require('../module/pagos.js');
const usersService = require('../module/usuarios.js');
const appPayments = express.Router();


appPayments.post('/payment', async (req, res) => {
  try {
    const { proyeccion_id, asiento, metodo_pago } = req.body;
    
    if (!proyeccion_id || !asiento || !metodo_pago) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the username from environment variables
    const username = process.env.MONGO_USER;
    console.log(username);
    if (!username) {
      return res.status(500).json({ error: 'MONGO_USER environment variable is not set' });
    }

    // Get user information
    const userService = new usersService();
    const userResult = await userService.getUserByUsername(username);
    if (!userResult.success) {
      console.log(user)
      return res.status(404).json({ error: 'User not found' });
    }

    const usuario_id = userResult.info.id;
    const paymentService = new payService();
    const result = await paymentService.payOnline({ proyeccion_id, usuario_id, asiento, metodo_pago });
    
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error in payment route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = appPayments;

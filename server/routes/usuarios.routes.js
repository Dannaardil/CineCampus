const express = require('express');
const usersService = require('../module/usuarios.js')

const appUsers = express.Router();

appUsers.post('/users/create', async (req, res) => {
    try {
        const { id, nombre, email, rol } = req.body;
        const createUser = new usersService();
        const result = await createUser.createAUser({ id, nombre, email, rol });
    
      
          res.status(200).json({ message: result });
      
         
        
      } catch (error) {
        console.error('Error in creating a user  route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
})
// {
//    "id":  9, 

//     "nombre":'David Romero', 
//     "email":'david@gmail.com',
//      "rol": 'administrador'
//     }

module.exports = appUsers
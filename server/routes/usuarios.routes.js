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
//     "id":  9, 
 
//      "nombre":"David Romero", 
//      "email":"david@gmail.com",
//       "rol": "administrador"
//      }


appUsers.get('/users/get/:id', async (req, res) => {
try{

    let getUser = new usersService();
    const result = await getUser.getUser({ id: req.params.id})
    res.status(200).send(result)

}catch (error) {
    console.error('Error in getting users', error)
    res.status(500).json({ error: 'Internal Server Error' });
}

})


//updateUser

appUsers.patch('/users/update', async (req,res)=>{

    try{
        const { id, username, rol } = req.body;


        let updateUser = new usersService();
        const result = await updateUser.updateUser({ id, username, rol });
         res.status(200).send(result)


    }catch(error){
        console.error('Error in updating users', error)
        res.status(500).json({ error: 'InternalServerError'})
    }

})
module.exports = appUsers
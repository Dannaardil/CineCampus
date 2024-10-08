// Dependencies
const express = require('express');
const usersService = require('../module/usuarios.js');
const Connection = require('../db/connect/connect.js');
const TicketService = require('../module/boletos.js');



// Initialize Router
const appUsers = express.Router();

// Route: Create User
appUsers.post('/users/create', async (req, res) => {
    try {
        const { id, nombre, email, rol } = req.body;
        const createUser = new usersService();
        const result = await createUser.createAUser({ id, nombre, email, rol });
        res.status(200).json({ message: result });
    } catch (error) {
        console.error('Error in creating a user route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
appUsers.get('/users/get/:username', async (req, res) => {
    try {
        let getUser = new usersService();
        const result = await getUser.getUserByUsername( { username: req.params.username});
        res.status(200).send(result);
    } catch (error) {
        console.error('Error in getting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route: Get User by ID
appUsers.get('/users/get/:id', async (req, res) => {
    try {
        let getUser = new usersService();
        const result = await getUser.getUser({ id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error in getting users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Update User
appUsers.patch('/users/update', async (req, res) => {
    try {
        const { id, username, rol } = req.body;
        let updateUser = new usersService();
        const result = await updateUser.updateUser({ id, username, rol });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error in updating users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Get Users by Role
appUsers.get('/users/getByRol/:rol', async (req, res) => {
    try {
        let getUser2 = new usersService();
        const result = await getUser2.getUsersByRol({ rol: req.params.rol });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error in getting users by role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
appUsers.get('/config', async(req, res) => {
    res.json({
        MONGO_USER: process.env.MONGO_USER,
        // other variables...
    });
});
appUsers.post('/api/user-tickets', async (req, res) => {
    try {
        const { username } = req.body;
        const ticketService = new TicketService();
        const userTickets = await ticketService.getUserTickets(username);
        
        res.json(userTickets);
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export Router
module.exports = appUsers;

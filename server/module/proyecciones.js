const { ObjectId } = require('mongodb');
const Connection = require('../../server/db/connect/connect.js');

class projectionsService {
    constructor() {
        this.connection = new Connection();
    }

    async getAvailableSeats({proyeccionId}) {
        try {
            const db = await this.connection.connect();
            
            const boletos = db.collection('boletos');
            const proyecciones = db.collection('proyecciones');
            const salas = db.collection('salas');
    
         
            
            // Find the projection and its associated sala
        
  
              let   projectionData = await proyecciones.findOne({ id: parseInt(proyeccionId) });
            
      
            
            if (!projectionData) {
                throw new Error('Projection not found');
            }
            
            const salaId = projectionData.sala_id;
  
    
            // Get all seats for the sala
            const salaData = await salas.findOne({ numero: salaId });
    
            if (!salaData) {
                throw new Error('Sala not found');
            }
            
            const allSeats = salaData.asientos;
    
            if (!allSeats || !Array.isArray(allSeats) || allSeats.length === 0) {
                throw new Error('No seats found for the specified sala');
            }
    
            const occupiedSeats = await boletos.find({ proyeccion_id: projectionData.id }).toArray();
    
            const availableSeats = allSeats.filter(seat => 
                !occupiedSeats.some(o => 
                    o.asiento && o.asiento.fila === seat.fila && o.asiento.numero === seat.numero
                )
            );
    
            console.log('Available seats:', availableSeats);
            return availableSeats;
        } catch (error) {
            console.error('Error checking seats availability:', error);
            throw error;
        }
    }
    
    async close() {
        await this.connection.close();
    }
}

module.exports = projectionsService;

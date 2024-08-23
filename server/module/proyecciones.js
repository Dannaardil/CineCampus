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
            let projectionData = await proyecciones.findOne({ pelicula_id: parseInt(proyeccionId) });

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

    async getAllSeats({proyeccionId}) {
        try {
            const db = await this.connection.connect();
            const proyecciones = db.collection('proyecciones');
            const salas = db.collection('salas');

            // Find the projection and its associated sala
            let projectionData = await proyecciones.findOne({ id: parseInt(proyeccionId) });

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

            console.log('All seats:', allSeats);
            return allSeats;
        } catch (error) {
            console.error('Error fetching all seats:', error);
            throw error;
        }
    }

    async getAllSeatsWithAvailability({movieId}) {
        try {
            const db = await this.connection.connect();
            const boletos = db.collection('boletos');
            const proyecciones = db.collection('proyecciones');
            const salas = db.collection('salas');
    
            // Find all projections for the movie
            let projectionData = await proyecciones.find({ pelicula_id: parseInt(movieId) }).toArray();
    
            if (!projectionData || projectionData.length === 0) {
                throw new Error('No projections found for this movie');
            }
    
            let allProjectionsSeats = [];
    
            for (let projection of projectionData) {
                const salaId = projection.sala_id;
    
                // Get all seats for the sala
                const salaData = await salas.findOne({ numero: salaId });
    
                if (!salaData) {
                    console.error(`Sala not found for projection ${projection.id}`);
                    continue;
                }
    
                const allSeats = salaData.asientos;
    
                if (!allSeats || !Array.isArray(allSeats) || allSeats.length === 0) {
                    console.error(`No seats found for sala ${salaId}`);
                    continue;
                }
    
                const occupiedSeats = await boletos.find({ proyeccion_id: projection.id }).toArray();
    
                const seatsWithAvailability = allSeats.map(seat => {
                    const isOccupied = occupiedSeats.some(o => 
                        o.asiento && o.asiento.fila === seat.fila && o.asiento.numero === seat.numero
                    );
                    return {
                        ...seat,
                        available: !isOccupied,
                        projectionId: projection.id
                    };
                });
    
                allProjectionsSeats.push({
                    projectionId: projection.id,
                    salaId: salaId,
                    seats: seatsWithAvailability
                });
            }
    
            console.log('All projections seats with availability:', allProjectionsSeats);
            return allProjectionsSeats;
        } catch (error) {
            console.error('Error fetching seats with availability:', error);
            throw error;
        }
    }

    async getProjectionById({movieId}) {
        try {
            const db = await this.connection.connect();
            const proyecciones = db.collection('proyecciones');
            return await proyecciones.findOne({ pelicula_id: parseInt(movieId) });
        } catch (error) {
            console.error('Error fetching projection:', error);
            throw error;
        }
    }
    async getProjectionsForWeek(movieId) {
        try {
            const db = await this.connection.connect();
            const proyecciones = db.collection('proyecciones'); // Define proyecciones here
            const today = new Date();
            const oneYearLater = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
            let data = await proyecciones.find({
                pelicula_id: parseInt(movieId),
                inicio: { $gte: today, $lt: oneYearLater }
            }).toArray();
            console.log('Projections found:', data);
            return data;
        } catch (error) {
            console.error('Error fetching projections for week:', error);
            throw error; // Rethrow the error so it can be caught in the route handler
        }
    }

    async getMovieDetails(movieId) {
        try {
            const db = await this.connection.connect();
            const peliculas = db.collection('peliculas');
            return await peliculas.findOne({ id: parseInt(movieId) });
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    }

    async getSalaDetails(salaId) {
        try {
            const db = await this.connection.connect();
            const salas = db.collection('salas');
            return await salas.findOne({ numero: parseInt(salaId) });
        } catch (error) {
            console.error('Error fetching sala details:', error);
            throw error;
        }
    }

    async close() {
        await this.connection.close();
    }
}

module.exports = projectionsService;

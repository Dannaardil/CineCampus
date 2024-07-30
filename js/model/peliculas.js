import Connection from '../../db/connect/connect.js';

export class MovieService {
  constructor() {
    this.connection = Connection;
  }
/**
 * Retrieves all available movies from the database.
 *
 * @returns {Promise<Array>} An array of available movies.
 */
  async getAllMovies() {
    try {
      const db = await this.connection.connect();
      const collection = db.collection('peliculas');
      const currentDate = new Date();

      const availableMovies = await collection.aggregate([
        {
          $lookup: {
            from: "proyecciones",
            localField: "id",
            foreignField: "pelicula_id",
            as: "proyecciones"
          }
        },
      
          {
          $project: {
            titulo: 1,
            fechaEstreno: 1,
            fechaRetiro: 1,
            sinopsis: 1,
            genero: 1,
            clasificacion: 1, 
            duracion: 1, 
            estaDisponible: {
              $and: [
                { $lte: ["$fechaEstreno", "$$NOW"] },
                { $gt: ["$fechaRetiro", "$$NOW"] }
              ]
            },
            horarios_proyeccion: "$proyecciones.inicio",
            
          }
        },
        {
          $match: {
            estaDisponible: true
          }
        }
      ]).toArray();

      return availableMovies;
    } catch (error) {
      console.error('Error checking movie availability:', error);
     
    }
    return ''
  }
  

  async close() {
    await this.connection.close();
  }
}


export default new MovieService();
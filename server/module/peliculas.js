const { ObjectId } = require('mongodb'); // Import ObjectId to work with MongoDB IDs
const Connection = require('../../server/db/connect/connect.js');

class MovieService {
  constructor() {
    this.connection = new Connection();
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
            sipnosis: 1,
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
    return '';
  }

  /**
   * Retrieves a movie by its ID from the database.
   *
   * @param {string} id - The ID of the movie to retrieve.
   * @returns {Promise<Object|null>} The movie object or null if not found.
   * 
   * 
   */

    
  async getMovieById(id) {
   
    try {
      
      const db = await this.connection.connect();
      const collection = db.collection('peliculas');

      const movie = await collection.find({ id:  id }).toArray();

      return movie;
    } catch (error) {
      console.error('Error retrieving movie by ID:', error);
      return null;
    }
  }

  async close() {
    await this.connection.close();
  }
}

module.exports = MovieService;

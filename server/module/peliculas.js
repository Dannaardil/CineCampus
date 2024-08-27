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
            id:1,
            titulo: 1,
            fechaEstreno: 1,
            fechaRetiro: 1,
            sipnosis: 1,
            genero: 1,
            clasificacion: 1, 
            duracion: 1, 
            poster_url:1,
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
   * @param {Object} params - An object containing the ID of the movie to retrieve
   * @param {string|number} params.id - The ID of the movie to retrieve
   * @returns {Promise<Object|null>} The movie object or null if not found
   */
  async getMovieById({ id }) {
    try {
      const db = await this.connection.connect();
      const collection = db.collection('peliculas');
      
      let movie;
      // Try to find by custom 'id' field first
      movie = await collection.findOne({ id: parseInt(id) });
      
   
   
      

      
      return movie 
    } catch (error) {
      console.error('Error retrieving movie by ID:', error);
      throw error;
    }
  }
   /**
   * Retrieves all movies that are not currently available but will be released in the future.
   *
   * @returns {Promise<Array>} An array of upcoming movies.
   */
   async getUpcomingMovies() {
    try {
      const db = await this.connection.connect();
      const collection = db.collection('peliculas');

      const upcomingMovies = await collection.aggregate([
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
            id:1,
            titulo: 1,
            fechaEstreno: 1,
            fechaRetiro: 1,
            sinopsis: 1,
            genero: 1,
            clasificacion: 1,
            duracion: 1,
            poster_url: 1,
            estaPorVenir: {
              $gt: ["$fechaEstreno", "$$NOW"]
            },
            horarios_proyeccion: "$proyecciones.inicio",
          }
        },
        {
          $match: {
            estaPorVenir: true
          }
        }
      ]).toArray();

    
      return upcomingMovies;

    } catch (error) {
      console.error('Error checking upcoming movies:', error);
    }
    return '';
  }

  async close() {
    await this.connection.close();
  }
}

module.exports = MovieService;

class MovieService {
    static async fetchMovies() {
      try {
        const response = await fetch('/api/movies/v1');
        return await response.json();
      } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
      }
    }
    static async fetchMoviesComming() {
        try {
          const response = await fetch('/api/movies/v2');
          return await response.json();
        } catch (error) {
          console.error('Error fetching movies:', error);
          throw error;
        }
      }
      static async fetchMoviesById() {
        try {
          const response = await fetch('/api/movies/:id');
          return await response.json();
        } catch (error) {
          console.error('Error fetching movies:', error);
          throw error;
        }
      }


   


  }
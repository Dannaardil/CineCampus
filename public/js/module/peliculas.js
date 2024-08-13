document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
  });
  
  async function loadMovies() {
    try {
      const movies = await MovieService.fetchMovies();
      displayMovies(movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }
  
  function displayMovies(movies) {
    const movieContainer = document.querySelector('.movie__carrusel');
    movieContainer.innerHTML = movies.map(movie => `
      <div class="movie__carrusel__cover">
        <img src="${movie.poster_url}" alt="${movie.titulo}">
        <h4>${movie.titulo}</h4>
        <p>${movie.genero}</p>
      </div>
    `).join('');
  }
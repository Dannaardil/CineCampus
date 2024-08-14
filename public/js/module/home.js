document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
  loadMoviesComming();
  setupSearch();
});
let allMovies = [];

async function loadMovies() {
  try {
    allMovies = await MovieService.fetchMovies();
    displayMovies(allMovies);
  } catch (error) {
    console.error('Error loading movies:', error);
  }
}

async function loadMoviesComming() {
  try {
    const movies = await MovieService.fetchMoviesComming();
    commingSoonMovies(movies);
  } catch (error) {
    console.error('Error loading movies:', error);
  }
}

function setupSearch() {
  const searchInput = document.querySelector('.search_bar input');
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  });
}

async function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();

  clearContainers();

  if (query.length === 0) {
    // If the query is empty, reload all movies and coming soon movies
    loadMovies();
    loadMoviesComming();
    return;
  }

  // Filter movies based on the query
  const filteredMovies = allMovies.filter(movie =>
    movie.titulo.toLowerCase().includes(query) ||
    movie.genero.toLowerCase().includes(query) ||
    (movie.actores && movie.actores.some(actor => actor.actor.toLowerCase().includes(query)))
  );

  // Display filtered movies
  displayMovies(filteredMovies);
}

// async function loadMoviesById() {
//   try {
//     const movies = await MovieService.fetchMoviesById();

//     ;
//     loadMoviesById(movies);
//   } catch (error) {
//     console.error('Error loading movies:', error);
//   }
// }

function clearContainers() {
  const main = document.querySelector(".movie__carrusel");
  const footer = document.querySelector(".comming__soon__movies");
  const footer_titule = document.querySelector(".comming__soon__title")
 const icons = document.querySelector(".carrusel__icons")
  if (main) main.innerHTML = "";
  if (footer) footer.innerHTML = "";
  if(footer_titule) footer_titule.innerHTML= "";
  if(icons) icons.innerHTML="";
}


function displayMovies(movies) {
  const movieContainer = document.querySelector('.movie__carrusel');
  movieContainer.innerHTML = movies.map(movie => `
      <div class="movie__carrusel__cover">
        <a href="/movie/${movie.id}">  
          <img  src="${movie.poster_url}" alt="${movie.titulo}">
          <h4>${movie.titulo}</h4>
          <p>${movie.genero}</p>
        </a>
      </div>
    `).join('');
}

function commingSoonMovies(movies) {
  const movieContainer = document.querySelector('.comming__soon__movies');
  movieContainer.innerHTML = movies.map(movie => `
      <div class="comming__soon__carrusel">
      

        <img src="${movie.poster_url}" alt="${movie.titulo}">
        <h5>${movie.titulo}</h5>
        <p>${movie.genero}</p>
      

                    </div>
    `).join('');

}

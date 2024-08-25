// Event Listener: DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
  loadMoviesComming();
  setupSearch();
  setupBottomNav();
});

// Variables
let allMovies = [];

// Load Movies
async function loadMovies() {
  try {
      allMovies = await MovieService.fetchMovies();
      displayMovies(allMovies);
  } catch (error) {
      console.error('Error loading movies:', error);
  }
}

// Load Coming Soon Movies
async function loadMoviesComming() {
  try {
      const movies = await MovieService.fetchMoviesComming();
      commingSoonMovies(movies);
  } catch (error) {
      console.error('Error loading movies:', error);
  }
}

// Setup Search Functionality
function setupSearch() {
  const searchInput = document.querySelector('.search_bar input');
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          handleSearch(event);
      }
  });
}

// Handle Search Input
async function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();
  clearContainers();

  if (query.length === 0) {
      loadMovies();
      loadMoviesComming();
      return;
  }

  const filteredMovies = allMovies.filter(movie =>
      movie.titulo.toLowerCase().includes(query) ||
      movie.genero.toLowerCase().includes(query) ||
      (movie.actores && movie.actores.some(actor => actor.actor.toLowerCase().includes(query)))
  );

  displayMovies(filteredMovies);
}

// Setup Bottom Navigation
function setupBottomNav() {
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
      item.addEventListener('click', (event) => {
          event.preventDefault();
          
          navItems.forEach(navItem => navItem.classList.remove('active'));
          item.classList.add('active');
          
          if (item.querySelector('span').textContent === 'Browse') {
              document.getElementById('searchInput').focus();
              window.scrollTo(0, 0);
          }
      });
  });
}

// Clear Containers
function clearContainers() {
  const main = document.querySelector(".movie__carrusel");
  const footer = document.querySelector(".comming__soon__movies");
  const footer_title = document.querySelector(".comming__soon__title");
  const icons = document.querySelector(".carrusel__icons");

  if (main) main.innerHTML = "";
  if (footer) footer.innerHTML = "";
  if (footer_title) footer_title.innerHTML = "";
  if (icons) icons.innerHTML = "";
}

// Display Movies
function displayMovies(movies) {
  const movieContainer = document.querySelector('.movie__carrusel');
  movieContainer.innerHTML = movies.map(movie => `
      <div class="movie__carrusel__cover">
          <a href="/movie/${movie.id}">  
              <img src="${movie.poster_url}" alt="${movie.titulo}">
              <h4>${movie.titulo}</h4>
              <p>${movie.genero}</p>
          </a>
      </div>
  `).join('');
}

// Display Coming Soon Movies
function commingSoonMovies(movies) {
  const movieContainer = document.querySelector('.comming__soon__movies');
  movieContainer.innerHTML = movies.map(movie => `
      <div class="comming__soon__carrusel">
          <a href="/movie/${movie.id}?coming_soon=true">
              <img src="${movie.poster_url}" alt="${movie.titulo}">
              <h5>${movie.titulo}</h5>
              <p>${movie.genero}</p>
          </a>
      </div>
  `).join('');
}
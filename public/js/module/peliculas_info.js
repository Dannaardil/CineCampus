document.addEventListener('DOMContentLoaded', () => {
    const movieId = window.location.pathname.split('/').pop();
    fetch(`/api/movies/${movieId}`)
      .then(response => response.json())
      .then(movie => {
        const movieDetailsContainer = document.getElementById('main');
        movieDetailsContainer.innerHTML = `
          <section id="video-main" class="video-main">
            <img src="${movie.poster_url}" alt="${movie.titulo}">

          


            
        </section>
        <section class="info_video-main">
            <div>
                <h5>${movie.titulo}</h5>
                <p>${movie.genero}</p>
            </div>
            <button>Watch Trailer</button>
        </section>
        <section class="detalle_video-main">
            <p class="p">${movie.sinopsis}</p>
            <div class="detalle_video-actor">
                <p>Cast</p>
                <div class="actor-list">
                    <div class="actor-info">
                        <img src="${movie.actores[0].actor_img}" alt="${movie.actores[0].actor}">
                        <div>
                            <p class="actor-name">${movie.actores[0].actor}</p>
                            <p class="actor-role">Puss in Boots</p>
                        </div>
                    </div>
                   <div class="actor-info">
                        <img src="${movie.actores[1].actor_img}" alt="${movie.actores[1].actor}">
                        <div>
                            <p class="actor-name">${movie.actores[2].actor}</p>
                            <p class="actor-role">Puss in Boots</p>
                        </div>
                    </div>
                   <div class="actor-info">
                        <img src="${movie.actores[2].actor_img}" alt="${movie.actores[2].actor}">
                        <div>
                            <p class="actor-name">${movie.actores[2].actor}</p>
                            <p class="actor-role">Puss in Boots</p>
                        </div>
                    </div>
                </div>
            </div>
             <div class="detalle_video-cinema">
                <p class="actor-name">Cinema</p>
                <div class="cinema-info">
                    <div>
                        <p class="actor-name">Campuslands</p>
                        <p class="actor-role">Zona Franca, Floridablanca</p>
                    </div>
                    <img src="https://i.postimg.cc/qRGy3vB2/furiosa.jpg" alt="Antonio Banderas">
                </div>
            </div>
        </section>
        `;
      })
      .catch(error => console.error('Error:', error));
  });
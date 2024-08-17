function getYouTubeVideoID(url) {
    const urlObj = new URL(url);
    let videoID;

    if (urlObj.pathname.startsWith('/embed/')) {
        // El ID del video es la parte después de "/embed/"
        videoID = urlObj.pathname.split('/embed/')[1].split('?')[0];
    } else {
        // Maneja otros casos (como con "v=")
        const urlParams = new URLSearchParams(urlObj.search);
        videoID = urlParams.get('v');
    }

    return videoID;
}

// Ejemplo de uso



document.addEventListener('DOMContentLoaded', () => {
    const movieId = window.location.pathname.split('/').pop();

    fetch(`/api/movies/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const videoId = getYouTubeVideoID(movie.trailer);
            const movieDetailsContainer = document.getElementById('body');

            movieDetailsContainer.innerHTML = `
             <header>
                <a href="/movies/"><i class='bx bx-chevron-left'></i></a>
                <h4>Cinema Selection</h4>
                <i class='bx bx-dots-vertical-rounded'></i>
            </header>
            <main id="main">
            <section class="video__container">
                <div id="cover-container" class="cover-main">
                    <img id="cover-image"  src=${movie.poster_url} alt=${movie.titulo}>
                </div>
                <lite-youtube id="video-main" class="video-main" videoid="${videoId}" style="display:none;"></lite-youtube>
            </section>

            <section class="info_video-main">
                <div>
                    <h5>${movie.titulo}</h5>
                    <p>${movie.genero}</p>
                </div>
                <button id="watch-trailer">Watch Trailer</button>
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
                                <p class="actor-role">${movie.actores[0].personaje}</p>
                            </div>
                        </div>
                        <div class="actor-info">
                            <img src="${movie.actores[1].actor_img}" alt="${movie.actores[1].actor}">
                            <div>
                                <p class="actor-name">${movie.actores[1].actor}</p>
                                <p class="actor-role">${movie.actores[1].personaje}</p>
                            </div>
                        </div>
                        <div class="actor-info">
                            <img src="${movie.actores[2].actor_img}" alt="${movie.actores[2].actor}">
                            <div>
                                <p class="actor-name">${movie.actores[2].actor}</p>
                                <p class="actor-role">${movie.actores[2].personaje}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detalle_video-cinema">
                    <p class="cinema-name">Cinema</p>
                    <div class="cinema-info" >
                        <div>
                            <p class="actor-name">Campuslands</p>
                            <p class="actor-role">Zona Franca, Floridablanca</p>
                        </div>
                        <img src="https://i.postimg.cc/qRGy3vB2/furiosa.jpg" alt="Antonio Banderas">
                    </div>
                </div>
            </section>
            </main>

             <footer>
                <a href="/seats2" class="button">
                    <button>Book Now</button>
                </a>
            
            </footer>
            `;

            // Event Listener para el botón "Watch Trailer"
            const watchTrailerButton = document.getElementById('watch-trailer');
            watchTrailerButton.addEventListener('click', () => {
                const coverImage = document.getElementById('cover-image');
                const video = document.getElementById('video-main');

                // Ocultar la portada y mostrar el video
                coverImage.style.display = 'none';
                video.style.display = 'block';
            });

            document.querySelector('.cinema-info').addEventListener('click', function() {
                this.classList.toggle('active');
            });
        })
        .catch(error => console.error('Error:', error));
});



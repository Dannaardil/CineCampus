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
                        <img src="data:image/png;base64,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" alt="campusLands">
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



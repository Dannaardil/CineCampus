function getYouTubeVideoID(url) {
    const urlObj = new URL(url);
    let videoID;

    if (urlObj.pathname.startsWith('/embed/')) {
        videoID = urlObj.pathname.split('/embed/')[1].split('?')[0];
    } else {
        const urlParams = new URLSearchParams(urlObj.search);
        videoID = urlParams.get('v');
    }

    return videoID;
}

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
                <i class="bi bi-three-dots-vertical"></i>
            </header>
            <main id="main">
            <section class="video__container">
                <div id="cover-container" class="cover-main">
                    <img id="cover-image" src=${movie.poster_url} alt=${movie.titulo}>
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
                    <div id="cinema-selection" class="cinema-info" >
                    <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHE7i80RsNKcg/company-logo_200_200/company-logo_200_200/0/1681242172220/campuslands_logo?e=2147483647&v=beta&t=fD-jCUuIRu8uYnOn-t6IIQuXyO9tEtwsZ39CkM8zlI0" alt="Campuslands">
                        <div>
                            <p class="actor-name">Campuslands</p>
                            <p class="actor-role">Zona Franca, Floridablanca</p>
                        </div>
                    </div>
                </div>
            </section>
            </main>

             <footer>
                <a href="/seat/${movie.id}" class="button">
                    <button id="book-now" disabled>Book Now</button>
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

            const cinemaSelection = document.getElementById('cinema-selection');
            const bookNowButton = document.getElementById('book-now');

            // Event Listener para seleccionar un cine
            cinemaSelection.addEventListener('click', function() {
                this.classList.toggle('active');
                bookNowButton.disabled = !this.classList.contains('active');
            });
        })
        .catch(error => console.error('Error:', error));
});

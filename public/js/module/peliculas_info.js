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
    const isComingSoon = new URLSearchParams(window.location.search).get('coming_soon') === 'true';

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
                        <div class="watch__trailer">
                        <button id="watch-trailer"><i class="bi bi-play-fill"></i>Watch Trailer</button>
                        </div>
                        
                    </section>

                    <section class="detalle_video-main">
                        <p class="p">${movie.sinopsis}</p>
                        <div class="detalle_video-actor">
                            <p>Cast</p>
                            <div class="actor-list">
                                ${movie.actores.slice(0, 3).map(actor => `
                                    <div class="actor-info">
                                        <img src="${actor.actor_img}" alt="${actor.actor}">
                                        <div>
                                            <p class="actor-name">${actor.actor}</p>
                                            <p class="actor-role">${actor.personaje}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="detalle_video-cinema">
                            <p class="cinema-name">Cinema</p>
                            <div id="cinema-selection" class="cinema-info " >
                               
                                <div>
                                    <p class="actor-name">Campuslands</p>
                                    <p class="actor-role">Zona Franca, Floridablanca</p>
                                </div>
                                 <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHE7i80RsNKcg/company-logo_200_200/company-logo_200_200/0/1681242172220/campuslands_logo?e=2147483647&v=beta&t=fD-jCUuIRu8uYnOn-t6IIQuXyO9tEtwsZ39CkM8zlI0" alt="Campuslands">
                            </div>
                        </div>
                    </section>
                </main>

              <footer>
                    <a href="/seat/${movie.id}" class="button">
                        <button id="book-now" disabled>
                            ${isComingSoon ? 'Coming Soon' : 'Book Now'}
                        </button>
                    </a>
                </footer>
            `; 

            // Event Listener for the "Watch Trailer" button
            const watchTrailerButton = document.getElementById('watch-trailer');
            watchTrailerButton.addEventListener('click', () => {
                const coverImage = document.getElementById('cover-image');
                const video = document.getElementById('video-main');

                coverImage.style.display = 'none';
                video.style.display = 'block';
            });

            // Only set up cinema selection if it's not a coming soon movie
            const cinemaSelection = document.getElementById('cinema-selection');
            const bookNowButton = document.getElementById('book-now');
            
            if (isComingSoon) {
                bookNowButton.disabled = true;
                cinemaSelection.style.pointerEvents = 'none';
                cinemaSelection.style.opacity = '0.5';
            } else {
                cinemaSelection.addEventListener('click', function() {
                    this.classList.toggle('active');
                    bookNowButton.disabled = !this.classList.contains('active');
                });
            }
        })
        .catch(error => console.error('Error:', error));
});
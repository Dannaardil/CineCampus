function formatTime(timeString) {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const configResponse = await fetch('/config');
        const config = await configResponse.json();
        const username = config.MONGO_USER;

        const userTickets = await getUserTickets(username);
        
        if (userTickets.length > 0) {
            createTicketCarousel(userTickets);
        } else {
            displayNoTicketsMessage();
        }
    } catch (error) {
        console.error('Error displaying tickets:', error);
        alert('Failed to load ticket information. Please try again.');
    }
});

async function getUserTickets(username) {
    const response = await fetch('/api/user-tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user tickets');
    }
    return await response.json();
}

function createTicketCarousel(tickets) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear existing content

    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'ticket-carousel-container';
    carouselContainer.style.cssText = `
        overflow-x: auto;
        white-space: nowrap;
        padding: 20px 0;
        -webkit-overflow-scrolling: touch;
    `;

    tickets.forEach(ticket => {
        const ticketElement = createTicketElement(ticket);
        ticketElement.style.cssText = `
            display: inline-block;
            vertical-align: top;
            margin-right: 20px;
            white-space: normal;
        `;
        carouselContainer.appendChild(ticketElement);
    });

    main.appendChild(carouselContainer);

    // Add smooth scrolling behavior
    carouselContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            carouselContainer.scrollLeft += e.deltaY;
        }
    });
}

function createTicketElement(ticket) {
    const ticketElement = document.createElement('section');
    ticketElement.className = 'ticket';
    ticketElement.innerHTML = `
        <div class="ticket__cover">
            <div class="ticket__cover__img">
                <img src="${ticket.pelicula.poster_url}" alt="movie-cover" id="movieCover">
            </div>
            <div class="movie__title__advice">
                <h3 class="movie__title">${ticket.pelicula.titulo}</h3>
                <p>show ticket at the entrance</p>
            </div>
        </div>
        <div class="divider"></div>
        <div class="botton__section">
            <div class="cinema">
                <div class="cinema__info">
                    <p>Cinema</p>
                    <h2>CampusLands</h2>
                </div>
                <div class="cinema__img">
                    <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHE7i80RsNKcg/company-logo_200_200/company-logo_200_200/0/1681242172220/campuslands_logo?e=2147483647&v=beta&t=fD-jCUuIRu8uYnOn-t6IIQuXyO9tEtwsZ39CkM8zlI0" alt="">
                </div>
            </div>
            <div class="info1">
                <div class="date">
                    <p>Date</p>
                    <h5>${new Date(ticket.proyeccion.inicio).toLocaleDateString()}</h5>
                </div>
                <div class="time">
                    <p>Time</p>
                    <h5>${formatTime(ticket.proyeccion.inicio)}</h5>
                </div>
            </div>
            <div class="info2">
                <div class="cinema__bottom">
                    <p>Cinema hall #</p>
                    <h5>campusLands</h5>
                </div>
                <div class="seat">
                    <p>Seat</p>
                    <h5>${ticket.asiento.fila}${ticket.asiento.numero}</h5>
                </div>
            </div>
            <div class="info3">
                <div class="cost">
                    <p>Cost</p>
                    <h5>${ticket.precio_total}</h5>
                </div>
                <div class="orderID">
                    <p>Order ID</p>
                    <h5>${ticket.codigo}</h5>
                </div>
            </div>
            <div class="divider2"></div>
            <div class="barCode">
                <img src="../img/barcode.png" alt="">
            </div>
        </div>
    `;
    return ticketElement;
}

function displayNoTicketsMessage() {
    const main = document.querySelector('main');
    main.innerHTML = '<p>No tickets found.</p>';
}
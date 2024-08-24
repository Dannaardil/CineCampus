let state = {
    movieId: window.location.pathname.split('/').pop(),
    weekProjections: [],
    selectedDate: null,
    selectedProjection: null,
    selectedSeats: []
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        state.weekProjections = await fetchProjections(state.movieId);
        if (state.weekProjections.length) {
            displayDates(state.weekProjections);
            await selectFirstAvailableDateTime(); // Make this call async
        } else {
            throw new Error('No projections available for this movie');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load movie information: ' + error.message);
    }
}
async function selectFirstAvailableDateTime() {
    if (state.weekProjections.length > 0) {
        const firstProjection = state.weekProjections[0];
        const firstDate = new Date(firstProjection.inicio);
        const firstDayElement = document.querySelector('.day');
        
        if (firstDayElement) {
            selectDate(firstDate, firstDayElement);
            
            // Select the first projection time
            const firstTimeElement = document.querySelector('.time');
            if (firstTimeElement) {
                await selectProjection(firstProjection, firstTimeElement);
            }
        }
    }
}
async function fetchSeatAvailability(movieId) {
    const response = await fetch(`/seats/withAvailability/${movieId}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
}

async function fetchProjections(movieId) {
    const response = await fetch(`/seats/api/projections/week/${movieId}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    console.log('Fetched projections:', data); // Add this line
    return Array.isArray(data[0]) ? data.flat() : data;
}

function displayDates(projections) {
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';
    const dates = [...new Set(projections.map(p => new Date(p.inicio).toDateString()))];

    dates.forEach((dateString) => {
        const date = new Date(dateString);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `<p>${formatDay(date)}</p><p>${date.getDate()}</p>`;
        dayDiv.addEventListener('click', () => selectDate(date, dayDiv));
        daysContainer.appendChild(dayDiv);
    });
}

function formatDay(date) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

function selectDate(date, element) {
    state.selectedDate = date;
    document.querySelectorAll('.day').forEach(day => day.classList.remove('active'));
    element.classList.add('active');
    const projectionsForDate = state.weekProjections.filter(p => new Date(p.inicio).toDateString() === date.toDateString());
    displayProjectionTimes(projectionsForDate);
    // Remove the clearSeats() call from here
}
function displayProjectionTimes(projections) {
    const timesContainer = document.querySelector('.times');
    timesContainer.innerHTML = '';
    
    projections.forEach((projection) => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        const formattedTime = formatTime(projection.inicio);
        timeDiv.innerHTML = `
            <p class="projection-time">${formattedTime}</p>
            <p class="price-format">
                $${projection.precio.toFixed(2)}
                <span class="movie-format">+${projection.formato || ''}</span>
            </p>
        `;
        timeDiv.addEventListener('click', () => selectProjection(projection, timeDiv));
        timesContainer.appendChild(timeDiv);
    });
}

function formatTime(timeString) {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24h to 12h format
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

async function selectProjection(projection, element) {
    try {
        state.selectedProjection = {
            ...projection,
            precio: parseFloat(projection.precio),
            formato: projection.formato // Assuming the format is included in the projection data
        };
        
        document.querySelectorAll('.time').forEach(time => time.classList.remove('active'));
        element.classList.add('active');

        // Clear seats before fetching new ones
        clearSeats();

        const seatAvailability = await fetchSeatAvailability(state.movieId);
        const currentProjectionSeats = seatAvailability.find(p => p.projectionId === projection.id);

        if (currentProjectionSeats) {
            displaySeats(currentProjectionSeats.seats);
            updateSeatAvailability(currentProjectionSeats.seats);
            updatePrice();
            // New function to update movie format
        } else {
            throw new Error('Seat information not found for this projection');
        }
    } catch (error) {
        console.error('Error selecting projection:', error);
        alert('Failed to load seat information: ' + error.message);
    }
}


async function fetchSalaDetails(salaId) {
    const response = await fetch(`/seats/api/sala/${salaId}`);
    if (!response.ok) throw new Error(`Failed to fetch sala details: HTTP ${response.status}`);
    return await response.json();
}

function displaySeats(seats) {
    const frontSeatsContainerA = document.createElement('div');
    frontSeatsContainerA.id = 'frontSeatsContainerA';
    frontSeatsContainerA.className = 'front__seats_row';

    const frontSeatsContainerB = document.createElement('div');
    frontSeatsContainerB.id = 'frontSeatsContainerB';
    frontSeatsContainerB.className = 'front__seats_row';

    const backSeatsContainer = document.getElementById('backSeatsContainer');
    
    // Clear existing content
    document.getElementById('frontSeatsContainer').innerHTML = '';
    backSeatsContainer.innerHTML = '';

    const frontRows = ['A', 'B'];
    const backRows = ['C', 'D', 'E', 'F'];

    seats.forEach(seat => {
        const seatDiv = document.createElement('div');
        const seatId = seat.fila + seat.numero;
        seatDiv.id = seatId;
        seatDiv.className = frontRows.includes(seat.fila) ? 'front__seat' : 'back__seat';
        seatDiv.classList.add(seat.tipo.toLowerCase());
        seatDiv.classList.add(seat.available ? 'available' : 'occupied');
        seatDiv.classList.add(`seat-${seatId}`);
        seatDiv.dataset.seatNumber = seat.numero;
        seatDiv.dataset.priceModifier = seat.tipo.toLowerCase() === 'vip' ? 1.5 : 1;
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatDiv, seat));

        if (seat.fila === 'A') {
            frontSeatsContainerA.appendChild(seatDiv);
        } else if (seat.fila === 'B') {
            frontSeatsContainerB.appendChild(seatDiv);
        } else {
            backSeatsContainer.appendChild(seatDiv);
        }
    });

    // Append the new front seat containers to the main front seats container
    const frontSeatsContainer = document.getElementById('frontSeatsContainer');
    frontSeatsContainer.appendChild(frontSeatsContainerA);
    frontSeatsContainer.appendChild(frontSeatsContainerB);
}

function updateSeatAvailability(seats) {
    seats.forEach(seat => {
        const seatElement = document.getElementById(seat.fila + seat.numero);
        if (seatElement) {
            seatElement.className = seat.available ? 'available' : 'occupied';
            seatElement.classList.remove('selected');
        }
    });
    state.selectedSeats = [];
    updatePrice();
}

function toggleSeatSelection(seatElement, seatInfo) {
    if (!seatInfo.available) return;

    const seatId = seatInfo.fila + seatInfo.numero;

    // If a seat is already selected and it's not the current seat, show message and return
    if (state.selectedSeats.length > 0 && !state.selectedSeats.some(seat => seat.id === seatId)) {
        alert("Please select only one seat. Deselect the current seat to choose a different one.");
        return;
    }

    // Toggle the current seat
    seatElement.classList.toggle('selected');
    seatElement.classList.toggle('available');

    // Show or hide the seat number based on selection
    if (seatElement.classList.contains('selected')) {
        seatElement.textContent = seatElement.dataset.seatNumber;
        state.selectedSeats = [{
            id: seatId,
            type: seatInfo.tipo,
            priceModifier: parseFloat(seatElement.dataset.priceModifier)
        }];
    } else {
        seatElement.textContent = '';
        state.selectedSeats = [];
    }

    updatePrice();
}

function updatePrice() {
    const priceElement = document.querySelector('.price p:last-child');
    let totalPrice = 0;
    
    if (state.selectedProjection && state.selectedProjection.precio) {
        state.selectedSeats.forEach(seat => {
            const basePrice = parseFloat(state.selectedProjection.precio);
            const seatPrice = basePrice * seat.priceModifier;
            totalPrice += seatPrice;
        });
    }
    
    priceElement.textContent = Number.isFinite(totalPrice) ? `$${totalPrice.toFixed(2)}` : '$0.00';
}

function clearSeats() {
    document.getElementById('frontSeatsContainer').innerHTML = '';
    document.getElementById('backSeatsContainer').innerHTML = '';
    state.selectedSeats = [];
    updatePrice();
}

document.querySelector('.buy button').addEventListener('click', async () => {
    if (!state.selectedSeats.length) {
        alert('Please select at least one seat before buying a ticket.');
    } else {
        try {
            let movieId =  window.location.pathname.split('/').pop()
            // Fetch movie details using the movieId from the state
            const movieResponse = await fetch(`/api/movies/${movieId}`);
            if (!movieResponse.ok) throw new Error(`HTTP error! status: ${movieResponse.status}`);
            const movieDetails = await movieResponse.json();

            // The selected projection is already in the state
            const selectedProjection = state.selectedProjection;

            // Combine movie details with selected projection and seats
            const orderInfo = {
                movieDetails: movieDetails,
                selectedProjection: selectedProjection,
                selectedSeats: state.selectedSeats,
                totalPrice: document.querySelector('.price p:last-child').textContent
            };

            // Store the combined information in localStorage
            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));

            // Redirect to the payment page
            window.location.href = '/all/';
        } catch (error) {
            console.error('Error fetching movie details:', error);
            alert('Failed to process your order. Please try again.');
        }
    }
});
document.getElementById('back-pelicula_detalle').addEventListener('click', e => {
    e.preventDefault();
    window.history.back();
});
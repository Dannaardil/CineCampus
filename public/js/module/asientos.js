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
        } else {
            throw new Error('No projections available for this movie');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load movie information: ' + error.message);
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
    clearSeats();
}

function displayProjectionTimes(projections) {
    const timesContainer = document.querySelector('.times');
    timesContainer.innerHTML = '';
    
    projections.forEach((projection) => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.innerHTML = `<p>${formatTime(projection.inicio)}</p><p>$${projection.precio.toFixed(2)}</p>`;
        timeDiv.addEventListener('click', () => selectProjection(projection, timeDiv));
        timesContainer.appendChild(timeDiv);
    });
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function selectProjection(projection, element) {
    try {
        state.selectedProjection = projection;
        document.querySelectorAll('.time').forEach(time => time.classList.remove('active'));
        element.classList.add('active');

        const seatAvailability = await fetchSeatAvailability(state.movieId);
        const currentProjectionSeats = seatAvailability.find(p => p.projectionId === projection.id);

        if (currentProjectionSeats) {
            displaySeats(currentProjectionSeats.seats);
            updateSeatAvailability(currentProjectionSeats.seats);
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
    const frontSeatsContainer = document.getElementById('frontSeatsContainer');
    const backSeatsContainer = document.getElementById('backSeatsContainer');
    frontSeatsContainer.innerHTML = '';
    backSeatsContainer.innerHTML = '';

    seats.forEach(seat => {
        const seatDiv = document.createElement('div');
        seatDiv.id = seat.fila + seat.numero;
        seatDiv.className = (seat.fila === 'A' || seat.fila === 'B') ? 'front__seat' : 'back__seat';
        seatDiv.textContent = seatDiv.id;
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatDiv, seat));

        (seat.fila === 'A' || seat.fila === 'B' ? frontSeatsContainer : backSeatsContainer).appendChild(seatDiv);
    });
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

    seatElement.classList.toggle('selected');
    seatElement.classList.toggle('available');

    const seatId = seatElement.id;
    if (seatElement.classList.contains('selected')) {
        if (!state.selectedSeats.includes(seatId)) {
            state.selectedSeats.push(seatId);
        }
    } else {
        state.selectedSeats = state.selectedSeats.filter(seat => seat !== seatId);
    }
    updatePrice();
}


function updatePrice() {
    const priceElement = document.querySelector('.price p:last-child');
    const totalPrice = state.selectedProjection ? state.selectedProjection.precio * state.selectedSeats.length : 0;
    priceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function clearSeats() {
    document.getElementById('frontSeatsContainer').innerHTML = '';
    document.getElementById('backSeatsContainer').innerHTML = '';
    state.selectedSeats = [];
    updatePrice();
}

document.querySelector('.buy button').addEventListener('click', () => {
    if (!state.selectedSeats.length) {
        alert('Please select at least one seat before buying a ticket.');
    } else {
        alert(`You've selected ${state.selectedSeats.length} seat(s) for a total of ${document.querySelector('.price p:last-child').textContent}`);
    }
});

document.getElementById('back-pelicula_detalle').addEventListener('click', e => {
    e.preventDefault();
    window.history.back();
});
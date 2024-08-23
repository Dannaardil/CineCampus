let selectedProjection = null;
let selectedSeats = [];
let movieId = window.location.pathname.split('/').pop();
let weekProjections = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        weekProjections = await fetchProjections(movieId);
        if (weekProjections.length) {
            displayDates(weekProjections);
            displayProjectionTimes(weekProjections);
            await initializeSeats();
        } else {
            alert('No projections available for this movie');
        }
    } catch (error) {
        alert('Failed to load projection information: ' + error.message);
    }
}

async function fetchProjections(movieId) {
    try {
        const response = await fetch(`/seats/api/projections/week/${movieId}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        let data = await response.json();
        return Array.isArray(data[0]) ? data.flat() : data;
    } catch (error) {
        console.error('Error fetching projections:', error);
        return [];
    }
}

function displayDates(projections) {
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';
    const dates = [...new Set(projections.map(p => new Date(p.inicio).toDateString()))];

    dates.forEach((dateString, index) => {
        const date = new Date(dateString);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `<p>${formatDay(date)}</p><p>${date.getDate()}</p>`;
        dayDiv.addEventListener('click', () => selectDate(date, dayDiv));
        if (index === 0) dayDiv.classList.add('active');
        daysContainer.appendChild(dayDiv);
    });
}

function formatDay(date) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

function selectDate(date, element) {
    document.querySelectorAll('.day').forEach(day => day.classList.remove('active'));
    element.classList.add('active');
    const projectionsForDate = weekProjections.filter(p => new Date(p.inicio).toDateString() === date.toDateString());
    displayProjectionTimes(projectionsForDate);
}

function displayProjectionTimes(projections) {
    const timesContainer = document.querySelector('.times');
    timesContainer.innerHTML = '';
    
    projections.forEach((projection, index) => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.innerHTML = `<p>${formatTime(projection.inicio)}</p><p>$${projection.precio.toFixed(2)}</p>`;
        timeDiv.addEventListener('click', () => selectProjection(projection, timeDiv));
        if (index === 0) timeDiv.classList.add('active');
        timesContainer.appendChild(timeDiv);
    });

    if (projections.length) selectProjection(projections[0], timesContainer.firstChild);
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function selectProjection(projection, element) {
    selectedProjection = projection;
    document.querySelectorAll('.time').forEach(time => time.classList.remove('active'));
    element.classList.add('active');

    try {
        const salaDetails = await fetchSalaDetails(projection.sala_id);
        updateSeatAvailability(salaDetails.asientos);
        updatePrice();
    } catch (error) {
        alert('Failed to load seat information');
    }
}

async function fetchSalaDetails(salaId) {
    const response = await fetch(`/seats/api/sala/${salaId}`);
    if (!response.ok) throw new Error('Failed to fetch sala details');
    return await response.json();
}

async function initializeSeats() {
    if (weekProjections.length) {
        const firstProjection = weekProjections[0];
        const salaDetails = await fetchSalaDetails(firstProjection.sala_id);
        displaySeats(salaDetails.asientos);
        updateSeatAvailability(salaDetails.asientos);
    }
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
        seatDiv.classList.add('available');
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatDiv));

        (seat.fila === 'A' || seat.fila === 'B' ? frontSeatsContainer : backSeatsContainer).appendChild(seatDiv);
    });
}

function updateSeatAvailability(availableSeats) {
    document.querySelectorAll('.front__seat, .back__seat').forEach(seat => {
        const seatInfo = availableSeats.find(s => s.fila + s.numero === seat.id);
        seat.className = seatInfo && seatInfo.available ? 'available' : 'occupied';
    });
    selectedSeats = [];
    updatePrice();
}

function toggleSeatSelection(seatElement) {
    if (seatElement.classList.contains('occupied')) return;

    if (seatElement.classList.toggle('selected')) {
        selectedSeats.push(seatElement.id);
    } else {
        selectedSeats = selectedSeats.filter(seat => seat !== seatElement.id);
    }
    updatePrice();
}

function updatePrice() {
    const priceElement = document.querySelector('.price p:last-child');
    const totalPrice = selectedProjection ? selectedProjection.precio * selectedSeats.length : 0;
    priceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

document.querySelector('.buy button').addEventListener('click', () => {
    if (!selectedSeats.length) {
        alert('Please select at least one seat before buying a ticket.');
    } else {
        alert(`You've selected ${selectedSeats.length} seat(s) for a total of ${document.querySelector('.price p:last-child').textContent}`);
    }
});

document.getElementById('back-pelicula_detalle').addEventListener('click', e => {
    e.preventDefault();
    window.history.back();
});

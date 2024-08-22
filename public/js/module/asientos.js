let selectedProjection = null;
let selectedSeats = [];
let movieId = null;
let weekProjections = [];

async function init() {
    movieId = window.location.pathname.split('/').pop();
    if (!movieId) {
        alert('No movie ID provided');
        return;
    }
    try {
        weekProjections = await fetchWeekProjections(movieId);
        displayDates(weekProjections);
        // Select today's date and first projection by default
        const today = new Date().toDateString();
        selectDate(today);
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load projection information');
    }
}

async function fetchWeekProjections(movieId) {
    try {
        const response = await fetch(`/seats/api/projections/week/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch projections');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projections:', error);
        return [];
    }
}

function displayDates(projections) {
    const dateContainer = document.getElementById('dateContainer');
    dateContainer.innerHTML = '';
    
    const dates = [...new Set(projections.map(p => new Date(p.inicio).toDateString()))];
    
    dates.forEach((date, index) => {
        const dateButton = document.createElement('button');
        dateButton.textContent = formatDate(date);
        dateButton.classList.add('date-button');
        if (index === 0) dateButton.classList.add('active');
        dateButton.addEventListener('click', () => selectDate(date));
        dateContainer.appendChild(dateButton);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}\n${date.getDate()}`;
}

function selectDate(date) {
    document.querySelectorAll('.date-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const projectionsForDate = weekProjections.filter(p => new Date(p.inicio).toDateString() === date);
    displayProjectionTimes(projectionsForDate);
}

function displayProjectionTimes(projections) {
    const projectionsContainer = document.getElementById('projectionsContainer');
    projectionsContainer.innerHTML = '';

    projections.forEach((projection, index) => {
        const timeButton = document.createElement('button');
        timeButton.innerHTML = `
            ${formatTime(projection.inicio)}<br>
            <span class="projection-type">${projection.formato}</span>
        `;
        timeButton.classList.add('time-button');
        if (index === 0) timeButton.classList.add('active');
        timeButton.addEventListener('click', () => selectProjection(projection));
        projectionsContainer.appendChild(timeButton);
    });

    // Select first projection by default
    if (projections.length > 0) {
        selectProjection(projections[0]);
    }
}

function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function selectProjection(projection) {
    selectedProjection = projection;
    document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    try {
        const salaDetails = await fetchSalaDetails(projection.sala_id);
        displaySeats(salaDetails.asientos, projection.id);
        updatePrice(projection.precio);
    } catch (error) {
        console.error('Error fetching seats:', error);
        alert('Failed to load seat information');
    }
}

async function fetchSalaDetails(salaId) {
    try {
        const response = await fetch(`/seats/api/sala/${salaId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch sala details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching sala details:', error);
        throw error;
    }
}

function displaySeats(seats, projectionId) {
    const seatsContainer = document.getElementById('seatsContainer');
    seatsContainer.innerHTML = '';

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        rowDiv.innerHTML = `<span class="row-letter">${row}</span>`;

        const rowSeats = seats.filter(seat => seat.fila === row);
        rowSeats.forEach(seat => {
            const seatButton = document.createElement('button');
            seatButton.className = `seat ${seat.tipo}`;
            seatButton.textContent = seat.numero;
            seatButton.addEventListener('click', () => toggleSeatSelection(seat, seatButton, projectionId));
            rowDiv.appendChild(seatButton);
        });

        seatsContainer.appendChild(rowDiv);
    });
}

function toggleSeatSelection(seat, element, projectionId) {
    if (selectedProjection.id !== projectionId) {
        alert('You can only select seats from the current projection');
        return;
    }
    
    const isSelected = selectedSeats.some(s => s.fila === seat.fila && s.numero === seat.numero);
    if (isSelected) {
        selectedSeats = selectedSeats.filter(s => s.fila !== seat.fila || s.numero !== seat.numero);
        element.classList.remove('selected');
    } else {
        selectedSeats.push(seat);
        element.classList.add('selected');
    }
    updateTotalPrice();
}

function updatePrice(price) {
    const priceElement = document.querySelector('.price p:last-child');
    priceElement.textContent = `$${(price * selectedSeats.length).toFixed(2)}`;
}

function updateTotalPrice() {
    updatePrice(selectedProjection.precio);
}

init();
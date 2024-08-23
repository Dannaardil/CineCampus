

let selectedProjection = null;
let selectedSeats = [];
let movieId = null;
let weekProjections = [];
movieId = window.location.pathname.split('/').pop();
console.log('Fetching projections for movie ID:', movieId);
async function init() {
    movieId = window.location.pathname.split('/').pop();
    console.log('Fetching projections for movie ID:', movieId);
    
    try {
        weekProjections = await fetchWeekProjections(movieId);
        console.log('Received weekProjections:', weekProjections);
        
        if (Array.isArray(weekProjections) && weekProjections.length > 0) {
            displayDates(weekProjections);
            displayProjectionTimes(weekProjections);
        } else {
            console.log('No projections available');
            alert('No projections available for this movie');
            return;
        }
        
        await initializeSeats();
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load projection information: ' + error.message);
    }
}

async function fetchWeekProjections(movieId) {
    try {
        console.log('Fetching projections for movie ID:', movieId);
        const response = await fetch(`/seats/api/projections/week/${movieId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        
        // If data is an array of arrays, flatten it
        if (Array.isArray(data) && Array.isArray(data[0])) {
            data = data.flat();
        }
        
        console.log('Received weekProjections:', data);
        return data;
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
        dayDiv.innerHTML = `
            <p>${formatDay(date)}</p>
            <p>${date.getDate()}</p>
        `;
        dayDiv.addEventListener('click', () => selectDate(date, dayDiv));
        if (index === 0) dayDiv.classList.add('active');
        daysContainer.appendChild(dayDiv);
    });
}

function formatDay(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
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
        timeDiv.innerHTML = `
            <p>${formatTime(projection.inicio)}</p>
            <p>$${projection.precio.toFixed(2)}</p>
        `;
        timeDiv.addEventListener('click', () => selectProjection(projection, timeDiv));
        if (index === 0) timeDiv.classList.add('active');
        timesContainer.appendChild(timeDiv);
    });

    if (projections.length > 0) {
        selectProjection(projections[0], timesContainer.firstChild);
    }
}

  









function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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


async function initializeSeats() {
    try {
        if (!weekProjections || weekProjections.length === 0) {
            throw new Error('No valid projections available');
        }
        
        const firstProjection = weekProjections[0];
        console.log('First projection:', firstProjection); // Debug log
        
        if (!firstProjection || !firstProjection.sala_id) {
            throw new Error('Invalid projection data');
        }
        
        const salaDetails = await fetchSalaDetails(firstProjection.sala_id);
        console.log('Sala details:', salaDetails); // Debug log
        displaySeats(salaDetails.asientos);
        updateSeatAvailability(salaDetails.asientos);
    } catch (error) {
        console.error('Error initializing seats:', error);
        alert('Failed to load seat information: ' + error.message);
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
        seatDiv.className = seat.fila === 'A' || seat.fila === 'B' ? 'front__seat' : 'back__seat';
        seatDiv.textContent = seat.fila + seat.numero;
        seatDiv.classList.add('available'); // Add 'available' class by default
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatDiv));

        if (seat.fila === 'A' || seat.fila === 'B') {
            frontSeatsContainer.appendChild(seatDiv);
        } else {
            backSeatsContainer.appendChild(seatDiv);
        }
    });
}

function updateSeatAvailability(availableSeats) {
    const allSeats = document.querySelectorAll('.front__seat, .back__seat');
    allSeats.forEach(seat => {
        const seatInfo = availableSeats.find(s => s.fila + s.numero === seat.id);
        if (seatInfo && seatInfo.available) {
            seat.classList.remove('occupied');
            seat.classList.add('available');
        } else {
            seat.classList.remove('available', 'selected');
            seat.classList.add('occupied');
        }
    });
    selectedSeats = []; // Clear selected seats when changing projection
    updatePrice();
}

function toggleSeatSelection(seatElement) {
    if (seatElement.classList.contains('occupied')) {
        return; // Cannot select occupied seats
    }

    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(seat => seat !== seatElement.id);
    } else {
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        selectedSeats.push(seatElement.id);
    }
    updatePrice();
    console.log('Selected seats:', selectedSeats); // Debug log
}

function updatePrice() {
    const priceElement = document.querySelector('.price p:last-child');
    const totalPrice = selectedProjection ? selectedProjection.precio * selectedSeats.length : 0;
    priceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Add event listener for buy ticket button
document.querySelector('.buy button').addEventListener('click', () => {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat before buying a ticket.');
    } else {
        alert(`You've selected ${selectedSeats.length} seat(s) for a total of ${document.querySelector('.price p:last-child').textContent}`);
        // Here you would typically send the selection to a server or proceed to a payment page
    }
});

// Add event listener for back button
document.getElementById('back-pelicula_detalle').addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
});

document.addEventListener('DOMContentLoaded', init);
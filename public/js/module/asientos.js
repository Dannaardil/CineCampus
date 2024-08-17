// seats.js

let selectedProjection = null;
let selectedSeats = [];
let movieId = null;

// Fetch all seats
async function fetchAllSeats() {
    try {
        const response = await fetch('/api/seats');
        if (!response.ok) {
            throw new Error('Failed to fetch seats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching seats:', error);
        return [];
    }
}

// Fetch projections for a specific movie and date
async function fetchProjections(date) {
    try {
        const response = await fetch(`/api/projections/${movieId}?date=${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch projections');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projections:', error);
        return [];
    }
}

// Display seats
function displaySeats(seats) {
    const container = document.getElementById('seatsContainer');
    container.innerHTML = '';

    seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.className = `seat ${seat.tipo}`;
        seatElement.innerHTML = `${seat.fila}${seat.numero}`;
        seatElement.addEventListener('click', () => toggleSeatSelection(seat, seatElement));
        container.appendChild(seatElement);
    });
}

// Display date selection
function displayDateSelection() {
    const container = document.getElementById('dateContainer');
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateButton = document.createElement('button');
        dateButton.innerText = date.toLocaleDateString();
        dateButton.addEventListener('click', () => fetchAndDisplayProjections(date.toISOString().split('T')[0]));
        
        container.appendChild(dateButton);
    }
}

// Fetch and display projections for a specific date
async function fetchAndDisplayProjections(date) {
    const projections = await fetchProjections(date);
    displayProjections(projections);
}

// Display projections
function displayProjections(projections) {
    const container = document.getElementById('projectionsContainer');
    container.innerHTML = '';

    projections.forEach(proj => {
        const projElement = document.createElement('div');
        projElement.className = 'projection';
        projElement.innerHTML = `
            <p>Start: ${new Date(proj.inicio).toLocaleTimeString()}</p>
            <p>Price: $${proj.precio}</p>
            <p>Format: ${proj.formato}</p>
        `;
        projElement.addEventListener('click', () => selectProjection(proj));
        container.appendChild(projElement);
    });
}

// Toggle seat selection
function toggleSeatSelection(seat, element) {
    if (!selectedProjection) {
        alert('Please select a projection first');
        return;
    }

    const index = selectedSeats.findIndex(s => s.fila === seat.fila && s.numero === seat.numero);
    if (index > -1) {
        selectedSeats.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedSeats.push(seat);
        element.classList.add('selected');
    }
    updateTotalPrice();
}

// Select a projection
function selectProjection(projection) {
    selectedProjection = projection;
    updateTotalPrice();
    // You might want to highlight the selected projection or provide some visual feedback
}

// Update total price
function updateTotalPrice() {
    const totalPrice = selectedSeats.length * (selectedProjection ? selectedProjection.precio : 0);
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}

// Initialize
async function init() {
    // Get the movie ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    movieId = urlParams.get('movieId');

    if (!movieId) {
        alert('No movie ID provided');
        return;
    }

    try {
        // Fetch and display all seats
        const allSeats = await fetchAllSeats();
        displaySeats(allSeats);

        // Display date selection
        displayDateSelection();

        document.getElementById('buyTicket').addEventListener('click', () => {
            if (selectedProjection && selectedSeats.length > 0) {
                alert(`Buying ${selectedSeats.length} tickets for projection at ${new Date(selectedProjection.inicio).toLocaleString()}`);
                // Here you would typically send this data to your server
            } else {
                alert('Please select a projection and at least one seat');
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load seat information');
    }
}

init();
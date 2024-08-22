let selectedProjection = null;
let selectedSeats = [];
let movieId = null;

// Fetch all seats with availability
async function fetchAllSeatsWithAvailability(movieId) {
    try {
        const response = await fetch(`/seats/withAvailability/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch seats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching seats:', error);
        return [];
    }
}

function displaySeats(allProjectionsSeats) {
    const seatsContainer = document.getElementById('seatsContainer');
    seatsContainer.innerHTML = '';

    allProjectionsSeats.forEach((projectionSeats, index) => {
        const projectionDiv = document.createElement('div');
        projectionDiv.className = 'projection';
        projectionDiv.innerHTML = `<h3>Projection ${projectionSeats.projectionId} (Sala ${projectionSeats.salaId})</h3>`;

        let frontSeatGroupHTML = '';
        let backSeatGroupHTML = '';

        projectionSeats.seats.forEach(seat => {
            const seatClass = seat.available ? 'available' : 'occupied';
            const seatHTML = `
                <div class="${seat.tipo}__seat ${seatClass}" id="${projectionSeats.projectionId}_${seat.fila}${seat.numero}">
                    ${seat.fila}${seat.numero}
                </div>
            `;

            if (seat.fila === 'A' || seat.fila === 'B') {
                frontSeatGroupHTML += seatHTML;
            } else {
                backSeatGroupHTML += seatHTML;
            }
        });

        const seatsHTML = `
            <div class="front__seats">
                <div class="front__letter">
                    <p>A</p>
                    <p>B</p>
                </div>
                <div class="group__seats_f">
                    ${frontSeatGroupHTML}
                </div>
            </div>
            <div class="back__seats">
                <div class="back__letter">
                    <p>C</p>
                    <p>D</p>
                    <p>E</p>
                    <p>F</p>
                </div>
                <div class="group__seats">
                    ${backSeatGroupHTML}
                </div>
            </div>
        `;

        projectionDiv.innerHTML += seatsHTML;
        seatsContainer.appendChild(projectionDiv);
    });

    // Add event listeners to available seats
    document.querySelectorAll('.available').forEach(seatElement => {
        seatElement.addEventListener('click', () => {
            const [projectionId, seatId] = seatElement.id.split('_');
            const [fila, numero] = seatId.split('');
            toggleSeatSelection({projectionId, fila, numero}, seatElement);
        });
    });
}

function toggleSeatSelection(seat, element) {
    if (selectedProjection && selectedProjection !== seat.projectionId) {
        alert('You can only select seats from one projection at a time');
        return;
    }
    selectedProjection = seat.projectionId;
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

async function init() {
    const movieId = window.location.pathname.split('/').pop();

    if (!movieId) {
        alert('No movie ID provided');
        return;
    }
    try {
        const allProjectionsSeats = await fetchAllSeatsWithAvailability(movieId);
        displaySeats(allProjectionsSeats);
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load seat information');
    }
}

init()
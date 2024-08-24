document.addEventListener('DOMContentLoaded', () => {
    try {
        const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        if (!orderInfo) throw new Error('No order information found');

        const { movieDetails, selectedProjection, selectedSeats, totalPrice } = orderInfo;
        console.log(movieDetails)
        // Update movie information
        document.querySelector('.movie__info2 p:first-child').textContent = movieDetails.titulo || 'Movie Title';
        document.querySelector('.movie__info2 p:last-child').textContent = movieDetails.genero || 'Genre';
        document.querySelector('.movie__info3 p:first-child').textContent = movieDetails.director || 'Director';
        document.querySelector('.movie__info3 p:last-child').textContent = new Date(selectedProjection.inicio).toLocaleDateString();

        // Update ticket information
        const ticketInfoDiv = document.querySelector('.ticket__info');
        ticketInfoDiv.innerHTML = `
            <p>${selectedSeats.length} TICKET${selectedSeats.length > 1 ? 'S' : ''}</p>
            <p>${selectedSeats.map(seat => seat.id).join(', ')}</p>
        `;

        // Update seat type and price
        const regularSeatDiv = document.querySelector('.ticket__info:nth-of-type(2)');
        regularSeatDiv.innerHTML = `
            <p>${selectedSeats[0].type.toUpperCase()} SEAT</p>
            <p>${totalPrice}</p>
        `;

        // Update service fee (if applicable)
        const serviceFeeDiv = document.querySelector('.ticket__info:nth-of-type(3)');
        if (serviceFeeDiv) {
            // You might want to calculate this based on your business logic
            const serviceFee = (parseFloat(totalPrice.replace('$', '')) * 0.05).toFixed(2);
            serviceFeeDiv.innerHTML = `
                <p>1 SERVICE FEE</p>
                <p>$${serviceFee}</p>
            `;
        }

        // Clear localStorage after using the information
        localStorage.removeItem('orderInfo');
    } catch (error) {
        console.error('Error displaying order information:', error);
        alert('Failed to load order information. Please try again.');
    }
});
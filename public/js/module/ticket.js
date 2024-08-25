document.addEventListener('DOMContentLoaded', () => {
    try {
        const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        if (!orderInfo) {
            throw new Error('No order information found');
        }
        const { movieDetails, selectedProjection, selectedSeats, totalPrice } = orderInfo;

        // Generate random order number
        const orderNumber = generateRandomOrderNumber();
        document.getElementById('orderNumber').textContent = orderNumber;

        // Update movie information
        document.getElementById('movieTitle').textContent = movieDetails.titulo || 'Movie Title';
        // You'll need to set the movie cover image source if available
        // document.getElementById('movieCover').src = movieDetails.coverImage || '';

        // Update date and time
        const projectionDate = new Date(selectedProjection.inicio);
        document.getElementById('movieDate').textContent = projectionDate.toLocaleDateString();
        document.getElementById('movieTime').textContent = projectionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Update seat information
        document.getElementById('seatInfo').textContent = selectedSeats.map(seat => seat.id).join(', ');

        // Update total cost
        document.getElementById('totalCost').textContent = totalPrice;

        // ... (keep the rest of your existing code) ...

    } catch (error) {
        console.error('Error displaying order information:', error);
        alert('Failed to load order information. Please try again.');
    }
});
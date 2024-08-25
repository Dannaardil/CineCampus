function formatTime(timeString) {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24h to 12h format
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        const paymentComplete = localStorage.getItem('paymentComplete');

      
        const { movieDetails, selectedProjection, selectedSeats} = orderInfo;

      
      // In your ticket.js
       document.getElementById('orderNumber').textContent = orderInfo.orderNumber;

        // Update movie information
        document.getElementById('movieTitle').textContent = movieDetails.titulo || 'Movie Title';
        // You'll need to set the movie cover image source if available
        document.getElementById('movieCover').src = movieDetails.poster_url || '';

        // Update date and time
        const projectionDate = new Date(selectedProjection.inicio);
        document.getElementById('movieDate').textContent = projectionDate.toLocaleDateString();
        document.getElementById('movieTime').textContent = formatTime(projectionDate)

        // Update seat information
        document.getElementById('seatInfo').textContent = selectedSeats.map(seat => seat.id).join(', ');

        // Update total cost
        document.getElementById('totalCost').textContent = orderInfo.totalPriceWithFee;

      
      

    } catch (error) {
        console.error('Error displaying order information:', error);
        alert('Failed to load order information. Please try again.');
        
    }
});
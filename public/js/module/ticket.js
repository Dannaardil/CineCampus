function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-US', options);
    
    // Add the ordinal suffix to the day
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    formattedDate = formattedDate.replace(/(\d+)/, `$1${suffix}`);
    
    return formattedDate;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

function formatTime(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
        document.getElementById('movieDate').textContent = formatDate(projectionDate);
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
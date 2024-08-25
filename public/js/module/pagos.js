function generateRandomOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const countDown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countDown);
            history.back(); // Go back to the previous page
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        if (!orderInfo) {
            throw new Error('No order information found');
        }
        const { movieDetails, selectedProjection, selectedSeats, totalPrice } = orderInfo;

        // Generate random order number
        const orderNumber = generateRandomOrderNumber();
        document.querySelector('.order__title p').textContent = `ORDER NUMBER: ${orderNumber}`;

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
        const regularSeatDiv = document.querySelector('.ticket__info2');
        regularSeatDiv.innerHTML = `
            <p>${selectedSeats[0].type.toUpperCase()} SEAT</p>
            <p>${totalPrice}</p>
        `;

        // Update service fee (if applicable)
        const serviceFeeDiv = document.querySelector('.ticket__info3');
        if (serviceFeeDiv) {
            const serviceFee = (parseFloat(totalPrice.replace('$', '')) * 0.05).toFixed(2);
            serviceFeeDiv.innerHTML = `
                <p>1 SERVICE FEE</p>
                <p>$${serviceFee}</p>
            `;
        }

        // Start the timer (3 minutes instead of 4)
        const timerDisplay = document.querySelector('.alert p:last-child');
        startTimer(3 * 60, timerDisplay);

      

        // Handle payment method selection and Buy ticket button
        const paymentMethodDiv = document.querySelector('.payment__method');
        const masterCardCheckbox = document.querySelector('.custom-checkbox input');
        const buyButton = document.querySelector('.buy button');

        // Initially disable the button
        buyButton.disabled = true;
        buyButton.style.opacity = '0.5';
        buyButton.style.cursor = 'not-allowed';

        function togglePaymentSelection() {
            masterCardCheckbox.checked = !masterCardCheckbox.checked;
            paymentMethodDiv.style.border = masterCardCheckbox.checked ? '1px solid var(--color9)' : '';
            
            if (masterCardCheckbox.checked) {
                buyButton.disabled = false;
                buyButton.style.opacity = '1';
                buyButton.style.cursor = 'pointer';
            } else {
                buyButton.disabled = true;
                buyButton.style.opacity = '0.5';
                buyButton.style.cursor = 'not-allowed';
            }
        }

        paymentMethodDiv.addEventListener('click', togglePaymentSelection);
        masterCardCheckbox.addEventListener('change', togglePaymentSelection);
        buyButton.addEventListener('click', async () => {
            try {
                const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
                console.log('orderinfo',orderInfo)
                if (!orderInfo) throw new Error('No order information found');
        
                const { selectedProjection, selectedSeats } = orderInfo;
        
                // Assuming selectedSeats[0] contains the seat information
                const seat = selectedSeats[0];
                console.log('selected ppro, seats',selectedProjection, selectedSeats)
                // Split the seat ID into row (letter) and number
                const [fila, numero] = seat.id.split('');
        
                const paymentData = {
                    proyeccion_id: selectedProjection.id,
                    // This should be dynamically set based on the logged-in user
                    asiento: {
                        fila: seat.id[0],
                        numero: parseInt(seat.id[1]),
                        tipo: seat.type.toLowerCase()
                    },
                    metodo_pago: 'tarjeta'
                };
                console.log('data payment', paymentData)
                
                const response = await fetch('/pay/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                });
            
                console.log('lo q se manda al servidor',response.json());

                if (!response.ok) {
                    throw new Error(`Payment failed: ${response.status} ${response.statusText}`);
                }
        
                const result = await response.json();
                alert(result.message);
                localStorage.removeItem('orderInfo');
                // Redirect or update UI here
            } catch (error) {
                console.error('Error processing payment:', error);
                alert('Payment failed. Please try again.');
            }
        });
         


    } catch (error) {
        console.error('Error displaying order information:', error);
        alert('Failed to load order information. Please try again.');
    }
    
});

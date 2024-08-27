

function generateRandomOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}
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
        orderInfo.orderNumber = orderNumber;
        document.querySelector('.order__title p').textContent = `ORDER NUMBER: ${orderNumber}`;
         document.querySelector('.movie__cover img').setAttribute('src', `${movieDetails.poster_url}`)
        // Update movie information
        document.querySelector('.movie__info2 p:first-child').textContent = movieDetails.titulo || 'Movie Title';
        document.querySelector('.movie__info2 p:last-child').textContent = movieDetails.genero || 'Genre';
        document.querySelector('.movie__info3 p:first-child').textContent =  'CampusLands';
        document.querySelector('.movie__info3 p:last-child').textContent = formatDate(selectedProjection.inicio);

        const priceNumber = parseFloat(totalPrice.replace('$', ''));
        const serviceFee = (priceNumber * 0.05).toFixed(2);
        const totalPriceWithFee = (priceNumber + parseFloat(serviceFee)).toFixed(2);
        orderInfo.totalPriceWithFee = totalPriceWithFee;
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

        localStorage.setItem('orderInfo', JSON.stringify(orderInfo));

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

        // Buy button click event
        buyButton.addEventListener('click', async () => {
            try {
                const updatedOrderInfo = JSON.parse(localStorage.getItem('orderInfo'));
                if (!updatedOrderInfo) throw new Error('No order information found');
        
                const { selectedProjection, selectedSeats, totalPriceWithFee, orderNumber } = updatedOrderInfo;
        
                const priceNumber = parseFloat(totalPrice.replace('$', ''));
                const seat = selectedSeats[0];
        
                const response2 = await fetch('/config');
                const config = await response2.json();
        
                const username = config.MONGO_USER;
                
                const userResponse = await fetch(`/users/get/${username}`);
                const userData = await userResponse.json();
                
                const userId = userData.info.id;
                const serviceFee = (parseFloat(priceNumber) * 0.05).toFixed(2)
                
                const paymentData = {
                    proyeccion_id: selectedProjection.id,
                    usuario_id: userId,
                    asiento: {
                        fila: seat.id[0],
                        numero: parseInt(seat.id.slice(1)),
                        tipo: seat.type.toLowerCase(),
                    },
                    metodo_pago: 'tarjeta', 
                    precio: priceNumber + parseFloat(serviceFee)
                };
        
                const response = await fetch('/pay/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    if (result.message === 'Pago realizado con exito!') {
                        alert(result.message);
                        localStorage.setItem('paymentComplete', 'true');
                        window.location.href = '/ticket/';
                    } else {
                        // Handle other successful responses that aren't a successful payment
                        alert(result.message);
                    }
                } else {
                    throw new Error(`Payment failed: ${result.error || response.statusText}`);
                }
        
            } catch (error) {
                console.error('Error processing payment:', error);
                alert('Payment failed: ' + error.message);
            }
        });
        
        
    } catch (error) {
        console.error('Error displaying order information:', error);
        alert('Failed to load order information. Please try again.');
    }
});

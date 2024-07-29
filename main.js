// import{testConnection} from './js/model/testConnection.js';
// import{getAllMovies} from './js/model/peliculas.js';
import{MovieService} from './js/model/peliculas.js';
import{ticketService} from './js/model/boletos.js';
import {usersService} from './js/model/usuarios.js'
import { payService } from './js/model/pagos.js';
// console.log(await testConnection())

//PELICULAS ---------------

let peliculas = new MovieService 

// QUERY #1 ----**Selección de Películas:**

 //console.log(await peliculas.getAllMovies())

let boletos = new ticketService

//QUERY 2 y QUERY  4 (comprar boletos y verificar tarjetas vip)

// console.log(await boletos.setTicket(2, 2, {
//     'fila': 'B',
//     'numero': 1,
//     'tipo': 'vip'
// }, 'efectivo' )) //proyeccion_id, usuario_id, asiento, metodo_pago

// ---------------------------------------------------------------

// QUERY #3.1 #3.2 (reservar asientos y cancelar la reserva)

console.log(await boletos.bookATicket(2, 2, {
     'fila': 'A',
    'numero': 2,
    'tipo': 'regular'
 }, 'efectivo' ))
 
// console.log(await boletos.cancelAReservation(41)) //cancelar reserva

// --------------------------------------------------------------------------


//USUARIOS---------------------

let usuarios = new usersService

// console.log(await usuarios.createAUser(4, 'Miguel Castro', 'miguel@gmail.com', 'vip'))

// console.log(await usuarios.getUser(2))
// console.log(await usuarios.updateUser(2, 'estandar')) 

// console.log(await usuarios.getUsersByRol('vip'))

let pagos = new payService

// QUERY #6 (Realizar compra de boletos en linea y ademas dar confirmacion)

// ------------------------------------------------------------------
// console.log(await pagos.payOnline(2, 2, {
//     'fila': 'C',
//     'numero': 2,
//     'tipo': 'vip'
// }, 'tarjeta' )) //proyeccion_id, usuario_id, asiento, metodo_pago
// import{testConnection} from './js/model/testConnection.js';
// import{getAllMovies} from './js/model/peliculas.js';
import{MovieService} from './js/model/peliculas.js';
import{ticketService} from './js/model/boletos.js';
import {usersService} from './js/model/usuarios.js'
// console.log(await testConnection())

// let obj = new MovieService
// console.log(await obj.getAllMovies())

// let obj2 = new ticketService

// console.log(await obj2.setTicket(2, 2, {
//     'fila': 'B',
//     'numero': 1,
//     'tipo': 'vip'
// }, 'efectivo' )) //proyeccion_id, usuario_id, asiento, metodo_pago

// console.log(await obj2.bookATicket(2, 2, {
//     'fila': 'B',
//     'numero': 1,
//     'tipo': 'vip'
// }, 'efectivo' ))

// console.log(await obj2.cancelAReservation(8))
let obj3 = new usersService

// console.log(await obj3.createAUser(4, 'Miguel Castro', 'miguel@gmail.com', 'vip'))

// console.log(await obj3.getUser(2))
console.log(await obj3.updateUser(2, 'estandar'))
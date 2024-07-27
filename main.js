// import{testConnection} from './js/model/testConnection.js';
// import{getAllMovies} from './js/model/peliculas.js';
import{MovieService} from './js/model/peliculas.js';
import{ticketService} from './js/model/boletos.js';
// const { MongoClient, ObjectId} = require('mongodb');
import { ObjectId } from 'mongodb';
// console.log(await testConnection())

// let obj = new MovieService
// console.log(await obj.getAllMovies())

let obj2 = new ticketService

console.log(await obj2.setTicket(2, 2, {
    'fila': 'B',
    'numero': 1,
    'tipo': 'vip'
}, 'efectivo' )) //proyeccion_id, usuario_id, asiento, metodo_pago
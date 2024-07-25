// import{testConnection} from './js/model/testConnection.js';
// import{getAllMovies} from './js/model/peliculas.js';
import{MovieService} from './js/model/peliculas.js';
let obj = new MovieService
// console.log(await testConnection())

console.log(await obj.getAllMovies())
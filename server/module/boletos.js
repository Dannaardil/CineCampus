const Connection = require('../../server/db/connect/connect.js');

class TicketService {
    constructor() {
        this.connection = new Connection();
    }

    /**
     * @description This function sets a ticket for a user in a specific seat.
     * @param {Object} ticketData - An object containing ticket information
     * @param {string} ticketData.proyeccion_id - The ID of the movie projection.
     * @param {string} ticketData.usuario_id - The ID of the user.
     * @param {string} ticketData.asiento - The seat number.
     * @param {string} ticketData.metodo_pago - The payment method.
     * @returns {Promise<Object>} - Returns an object with the result of the operation.
     * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
     */
    async setTicket({ proyeccion_id, usuario_id, asiento, metodo_pago }) {
        const db = await this.connection.connect();

        try {
            const boletos = db.collection('boletos');
            const proyecciones = db.collection('proyecciones');
            const usuarios = db.collection('usuarios');
            const salas = db.collection('salas');
            const pagos = db.collection('pagos');

            let currentDate = new Date();
            let descuento_aplicado = 0;

            function generarNumeroAleatorio() {
                return Math.floor(Math.random() * 999) + 1;
            }
            function generarNumeroAleatorio1() {
                return Math.floor(Math.random() * 99) + 1;
            }
            let numero = generarNumeroAleatorio();
            let numero1 = generarNumeroAleatorio1();

            let operacion1 = await proyecciones.find({ id: proyeccion_id }).toArray();
            let operacion2 = await usuarios.find({ id: usuario_id }).toArray();
            let operacion5 = await boletos.find({ asiento: asiento }).toArray();
            let operacion6 = await usuarios.find({ "tarjeta_vip.estado": "Activa" }).toArray();

            let operacion7 = await boletos.find({ "codigo": numero }).toArray();

            const operacion8 = await salas.find({
                "asientos": {
                    $elemMatch: asiento
                }
            }).toArray();
            let operacion9 = await pagos.find({ "id": numero1 }).toArray();
                 
            function verificarAsientosOcupados() {
                let asientoOcupado = false;
                for (let i = 0; i < operacion5.length; i++) {
                    if (operacion5[i].proyeccion_id === proyeccion_id) {
                        asientoOcupado = true;
                        break;
                    }
                }
                return asientoOcupado;
            }

            let asientoEstaOcupado = verificarAsientosOcupados();

            if (operacion1.length === 0 || operacion2.length === 0) {
                return { message: 'No se encontro la proyeccion o usuario' };
            } else if (operacion1[0].fin < currentDate) {
                return { message: 'La proyeccion ya termino' };
            } else if (asientoEstaOcupado) {
                return { message: 'El asiento esta ocupado' };
            } else if (operacion8.length == 0) {
                return { message: 'El asiento no existe' };
            } else {
                if (operacion7.length != 0) {
                    numero = generarNumeroAleatorio();
                }
                if (operacion9.length != 0) {
                    numero1 = generarNumeroAleatorio1();
                }

                console.log('----------Se procedera con el pago...');

                if (operacion2[0].rol == 'vip' && operacion6.length != 0) {
                    descuento_aplicado = (operacion1[0].precio * 0.10);
                    console.log('El usuario es vip, se le aplicara descuento de:', descuento_aplicado);
                } else if (operacion2[0].rol == 'vip' && operacion6.length == 0) {
                    console.log('El usuario es vip pero su tarjeta no esta activa, no se le aplicara descuento');
                }

                await boletos.insertOne({
                    proyeccion_id: proyeccion_id,
                    usuario_id: usuario_id,
                    asiento: asiento,
                    precio_total: (operacion1[0].precio - descuento_aplicado),
                    descuento_aplicado: descuento_aplicado,
                    fecha_compra: currentDate,
                    codigo: numero
                });
               
                await pagos.insertOne({
                    monto: (operacion1[0].precio - descuento_aplicado),
                    metodo_pago: metodo_pago,
                    estado: 'completado',
                    fecha_de_pago: currentDate,
                    tipo_transaccion: 'compra',
                    boleto_cod: numero,
                    id: numero1
                });

                return { message: 'Pago realizado con exito!' };
            }
        } catch (error) {
            console.log('error ', error);
            throw error;
        }
    }

    /**
     * @description This function books a ticket for a user in a specific seat.
     * @param {Object} bookingData - An object containing booking information
     * @param {string} bookingData.proyeccion_id - The ID of the movie projection.
     * @param {string} bookingData.usuario_id - The ID of the user.
     * @param {string} bookingData.asiento - The seat number.
     * @param {string} bookingData.metodo_pago - The payment method.
     * @returns {Promise<Object>} - Returns an object with the result of the operation.
     * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
     */


    async bookATicket({proyeccion_id, usuario_id, asiento, metodo_pago}){
        const db = await this.connection.connect();

        try
        {const boletos = db.collection('boletos');
        const proyecciones = db.collection('proyecciones');
        const usuarios = db.collection('usuarios');
        const salas = db.collection('salas');
        const pagos = db.collection('pagos');

        let currentDate = new Date();
        let descuento_aplicado = 0

        function generarNumeroAleatorio() {
            return Math.floor(Math.random() * 999) + 1;
        }
        function generarNumeroAleatorio1() {
            return Math.floor(Math.random() * 99) + 1;
        }
        let numero = generarNumeroAleatorio();
        let numero1 = generarNumeroAleatorio1();

        let operacion1 = await proyecciones.find({ id: proyeccion_id }).toArray();
        let operacion2 = await usuarios.find({ id: usuario_id }).toArray();
        let operacion5 = await boletos.find({ asiento: asiento }).toArray();
        let operacion6 = await usuarios.find({ "tarjeta_vip.estado": "Activa" }).toArray()

        let operacion7 = await boletos.find({ "codigo": numero }).toArray();
     

        const operacion8 = await salas.find({
            "asientos": {
                $elemMatch: asiento
            }
        }).toArray();
        let operacion9 = await pagos.find({ "id": numero1 }).toArray();
         
           
        function verificarAsientosOcupados() {
            let asientoOcupado = false;
            for (let i = 0; i < operacion5.length; i++) {
                if (operacion5[i].proyeccion_id === proyeccion_id) {
                    asientoOcupado = true;
                    break; // Salimos del bucle al encontrar el primer asiento ocupado
                }
            }
        return asientoOcupado
        
        }

        let asientoEstaOcupado = verificarAsientosOcupados()
        
       



        if (operacion1.length === 0 || operacion2.length === 0) {

            return('No se encontro la proyeccion o usuario ');


        } else if (operacion1[0].fin < currentDate) {
            return(' la proyeccion ya termino ')
        
            
        } 
        
        else if (operacion8.length == 0) {
            return('el asiento no existe ')

        }else if(asientoEstaOcupado){
            return('El asiento esta ocupado')


        }


       

        else {
            
            if (operacion7.length != 0) {
                numero = generarNumeroAleatorio()
            }
            if (operacion9.length != 0) {
                numero1 = generarNumeroAleatorio1()

            }



            console.log('----------Se procedera con la reseva...')



            if (operacion2[0].rol == 'vip' && operacion6.length != 0) {

                descuento_aplicado = (operacion1[0].precio * 0.10)

                console.log(' el usuario el vip, se le aplicara descuento de:', descuento_aplicado)

            } else if (operacion2[0].rol == 'vip' && operacion6.length == 0) {
                return('el usuario es vip pero su tarjeta no esta activa, no se le aplicara descuento')
            }
            let fecha_pago = operacion1[0].inicio
          

                await boletos.insertOne({

                proyeccion_id: proyeccion_id,
                usuario_id: usuario_id,
                asiento: asiento,
                precio_total: (operacion1[0].precio - descuento_aplicado),
                descuento_aplicado: descuento_aplicado,
                fecha_compra: currentDate,
                codigo: numero
            })
           
            await pagos.insertOne({

                monto: (operacion1[0].precio - descuento_aplicado),
                metodo_pago: metodo_pago,
                estado: 'pendiente',
                fecha_de_pago: fecha_pago,
                boleto_cod: numero,
                id: numero1,
                tipo_transaccion: 'Reserva'
            })
            let operacion10 = await pagos.find({id:numero1}).toArray()
            
            console.log('Reserva realizada con exito!-------------------------------')
            console.log('recibo (con el id podra cancelarlo) -------------------------------', operacion10)
            
            console.log('Tienes plazo hasta un dia antes del: ', fecha_pago, ' para realizar el pago o se le cancelara el boleto.')
        }
        return { 
            message: 'Reserva realizada con exito!',
      
        
        };
    } catch (error) {
        console.log('error ', error);
        throw error;
    }

  

}
/**
     * @description This function cancels a reservation for a user in a specific seat.
     * @param {Object} cancelData - An object containing cancellation information
     * @param {string} cancelData.id - The ID of the reservation to be cancelled.
     * @returns {Promise<Object>} - Returns an object with the result of the operation.
     * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
     */
async cancelAReservation({ id }) {
    const db = await this.connection.connect();
    try {
      const pagos = db.collection('pagos');
      const boletos = db.collection('boletos');
  
      // Check if the payment exists
      const operacion1 = await pagos.findOne({ id: parseInt(id) }); // Use findOne for efficiency
      if (!operacion1) {
        return 'Este boleto no existe.'; // Clearer error message
      }
  
      // Check if the reservation is already canceled
      if (operacion1.estado === 'cancelado') {
        return 'Este boleto ya fue cancelado.';
      }
  
      // Check if it's a reservation
      if (operacion1.tipo_transaccion !== 'Reserva') {
        return 'Este boleto no es una reserva.';
      }
  
      // Update payment status and delete ticket
      await pagos.updateOne({ id: parseInt(id) }, { $set: { estado: 'cancelado' } });
      await boletos.deleteOne({ codigo: operacion1.boleto_cod });
  
      console.log('El boleto fue cancelado exitosamente');
  
      // Fetch updated payment info (optional)
      const info = await pagos.findOne({ id });
      console.log('Esta es la informacion del boleto cancelado: ', info);
  
      return {
        message: 'El boleto fue cancelado exitosamente',
      
      };
    } catch (error) {
      console.error('Error con la operacion', error);
      throw error;
    }
  }

 /**
  * @async
  * @function getUserTickets
  * @param {string} username - The username of the user whose tickets are to be retrieved.
  * @returns {Promise<Array>} - A promise that resolves to an array of objects, each representing a movie ticket with detailed information about the projection, movie, and cinema hall.
  * @throws {Error} - Throws an error if the user is not found in the database.
  */

    async getUserTickets(username) {
        try {
            const connection = new Connection();
            const db = await connection.connect();
            const boletos = db.collection('boletos');
            const usuarios = db.collection('usuarios');

            const user = await usuarios.findOne({ nombre: username });
            if (!user) {
                throw new Error('User not found');


            }
            console.log(user)

            const userTickets = await boletos.aggregate([
                { $match: { usuario_id: user.id } },
                {
                    $lookup: {
                        from: 'proyecciones',
                        localField: 'proyeccion_id',
                        foreignField: 'id',
                        as: 'proyeccion'
                    }
                },
                { $unwind: '$proyeccion' },
                {
                    $lookup: {
                        from: 'peliculas',
                        localField: 'proyeccion.pelicula_id',
                        foreignField: 'id',
                        as: 'pelicula'
                    }
                },
                { $unwind: '$pelicula' },
                {
                    $lookup: {
                        from: 'salas',
                        localField: 'proyeccion.sala_id',
                        foreignField: 'numero',
                        as: 'sala'
                    }
                },
                { $unwind: '$sala' },
                {
                    $project: {
                        _id: 1,
                        codigo: 1,
                        precio_total: 1,
                        descuento_aplicado: 1,
                        fecha_compra: 1,
                        asiento: 1,
                        'pelicula.titulo': 1,
                        'pelicula.poster_url': 1,
                        'proyeccion.inicio': 1,
                        'proyeccion.fin': 1,
                        'sala.numero': 1
                    }
                }
            ]).toArray();
            console.log(userTickets)

            return userTickets;
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
    }
}
  




}

module.exports =  TicketService;



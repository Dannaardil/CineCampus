import Connection from '../../db/connect/connect.js';

export class ticketService {
    constructor() {
        this.connection = Connection;
    }
    /**
 * @description This function sets a ticket for a user in a specific seat.
 * @param {string} proyeccion_id - The ID of the movie projection.
 * @param {string} usuario_id - The ID of the user.
 * @param {string} asiento - The seat number.
 * @param {string} metodo_pago - The payment method.
 * @returns {string} - Returns an empty string after setting the ticket.
 * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
 * @docParam {string} proyeccion_id - The ID of the movie projection.
 * @docParam {string} usuario_id - The ID of the user.
 * @docParam {string} asiento - The seat number.
 * @docParam {string} metodo_pago - The payment method.
 */

    async setTicket(proyeccion_id, usuario_id, asiento, metodo_pago) {




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



            } else if (asientoEstaOcupado) {
                return('El asiento esta ocupado')
         

            }

            else if (operacion8.length == 0) {
                return('el asiento no existe ')

            }



            else {

                if (operacion7.length != 0) {
                    numero = generarNumeroAleatorio()
                }
                if (operacion9.length != 0) {
                    numero1 = generarNumeroAleatorio1()

                }



                console.log('----------Se procedera con el pago...')



                if (operacion2[0].rol == 'vip' && operacion6.length != 0) {

                    descuento_aplicado = (operacion1[0].precio * 0.10)

                    return(' el usuario el vip, se le aplicara descuento de:', descuento_aplicado)

                } else if (operacion2[0].rol == 'vip' && operacion6.length == 0) {
                    return('el usuario es vip pero su tarjeta no esta activa, no se le aplicara descuento')
                }


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
                    estado: 'completado',
                    fecha_de_pago: currentDate,
                    tipo_transaccion: 'compra',
                    boleto_cod: numero,
                    id: numero1
                })

                return('Pago realizado con exito!')
            }
     

        } catch (error) {
            console.log('error ', error);

        }

        return ''

    }
    /**
 * @description This function sets a ticket for a user in a specific seat.
 * @param {string} proyeccion_id - The ID of the movie projection.
 * @param {string} usuario_id - The ID of the user.
 * @param {string} asiento - The seat number.
 * @param {string} metodo_pago - The payment method.
 * @returns {string} - Returns an empty string after setting the ticket.
 * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
 * @docParam {string} proyeccion_id - The ID of the movie projection.
 * @docParam {string} usuario_id - The ID of the user.
 * @docParam {string} asiento - The seat number.
 * @docParam {string} metodo_pago - The payment method.
 */

    async bookATicket(proyeccion_id, usuario_id, asiento, metodo_pago){
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

                return(' el usuario el vip, se le aplicara descuento de:', descuento_aplicado)

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
 

    } catch (error) {
        console.log('error ', error);

    }

    return ''

}
/**
 * @description This function cancels a reservation for a user in a specific seat.
 * @param {string} id - The ID of the reservation to be cancelled.
 * @returns {string} - Returns an empty string after cancelling the reservation.
 * @throws {Error} - Throws an error if there's an issue with the database connection or operation.
 * @docParam {string} id - The ID of the reservation to be cancelled.
 */
async cancelAReservation(id) {

    const db = await this.connection.connect();
    try{
        const pagos = db.collection('pagos');
        const boletos = db.collection('boletos');
 // verificar el pago si exista osea que el boleto ya esta reservado y que sea  una reserva
 // verificar el boleto si ya ha sido cancelado


        let operacion1 = await pagos.find({id: id}).toArray()
     
        if (operacion1 === 0){
            return('este boleto no existe ')
        }else if(operacion1[0].estado === 'cancelado'){
            return('este boleto ya fue cancelado')
        }else if(operacion1[0].tipo_transaccion !== 'Reserva'){
            return('este boleto no es una reserva')
        }else{
            
            await pagos.updateOne({id: id}, {$set: {estado: 'cancelado'}})
            await boletos.deleteOne({codigo: operacion1[0].boleto_cod})
            // se elimina el boleto para que no aparezca el asiento ocupado

            console.log(' El boleto fue cancelado exitosamente')
            let info = await pagos.find({id: id}).toArray()
            console.log(' Esta es la informacion del boleto cancelado: ',  info)
        }






    }catch(error){
        console.log('Error con la operacion', error)
    }

    return ''

}








}



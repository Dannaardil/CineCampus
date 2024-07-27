import Connection from '../../db/connect/connect.js';

export class ticketService {
    constructor() {
        this.connection = Connection;
    }


    async setTicket(proyeccion_id, usuario_id, asiento, metodo_pago) {



        try {
            const db = await this.connection.connect();
            const boletos = db.collection('boletos');
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



            if (operacion1.length === 0 || operacion2.length === 0) {

                console.log('No se encontro la proyeccion o usuario ');


            } else if (operacion1[0].fin < currentDate) {
                console.log(' la proyeccion ya termino ')



            } else if (operacion5.length != 0) {
                console.log('El asiento esta ocupado')


            }

            else if (operacion8.length == 0) {
                console.log('el asiento no existe ')

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

                    console.log(' el usuario el vip, se le aplicara descuento de:', descuento_aplicado)

                } else if (operacion2[0].rol == 'vip' && operacion6.length == 0) {
                    console.log('el usuario es vip pero su tarjeta no esta activa, no se le aplicara descuento')
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

                console.log('Pago realizado con exito!')
            }
        } catch (error) {
            console.log('error regitering ticket:', error);

        }

        return ''

    }





}
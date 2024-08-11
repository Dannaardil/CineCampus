const Connection = require('../../server/db/connect/connect.js');

 class payService {
    constructor() {
        this.connection = new Connection();
    }
    /**
 * @description This function is responsible for processing an online payment for a movie ticket.
 * @param {number} proyeccion_id - The ID of the movie projection.
 * @param {number} usuario_id - The ID of the user.
 * @param {string} asiento - The seat number for the ticket.
 * @param {string} metodo_pago - The payment method used.
 * @returns {string} An empty string upon successful execution.
 * @throws {Error} If there is an error during the execution of the function.
 * @example
 * payOnline(123, 456, 'A1', 'Credit Card');
 */
    async payOnline({proyeccion_id, usuario_id, asiento, metodo_pago}) {



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
                    tipo_transaccion: 'compra en linea',
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


    async close() {
        await this.connection.close();
    }
}

module.exports = payService
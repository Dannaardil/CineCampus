import Connection from '../../db/connect/connect.js';

export class usersService {
    constructor() {
        this.connection = Connection;
    }

    async createAUser(id, nombre, email, rol) {
        try {
            const db = await this.connection.connect();
            function generar_tarjeta() {

                return Math.floor(Math.random() * 99) + 1;

            }
            let numero_f = generar_tarjeta()


            let numero = 'VIP12345' + numero_f.toString()

            let dataInsertUser = {
                nombre: nombre,
                email: email,
                rol: rol,
                id: id

            }

            let dataInsertVip = {
                nombre: nombre,
                email: email,
                rol: rol,
                tarjeta_vip: {
                    numero: numero,
                    estado: 'Activa'

                },
                id: id

            }
            const usuarios = db.collection('usuarios');

            // verificar q el numero id no sea el mismo q ya  existe
            // verifiicar que el usuario no exista 
            //verificar que la ## de tarjeta no exista


            let operacion1 = await usuarios.find({ id: id }).toArray();
            let operacion2 = await usuarios.find({ email: email }).toArray();
            let operacion3 = await usuarios.find({ "tarjeta_vip.numero": numero }).toArray();
            if (operacion3.length != 0) {
                numero_f = generar_tarjeta()
                numero = 'VIP12345' + numero_f.toString()
            }

            if (operacion1.length != 0 || operacion2.length != 0) {
                console.log(' el usuario ya existe o el correo ya fue registrado.')
            }

            else{
                if (rol == 'vip') {
                    await usuarios.insertOne(dataInsertVip)
                    console.log('el usuario vip se ha registrado correctamente', dataInsertVip)
                    console.log('se le ha generado un numero de tarjeta vip activa su numero es ' + numero)
                }
                if (rol === 'usuario' || rol === 'administrador') {
                           await usuarios.insertOne(dataInsertUser)
                           console.log(' se ha registrado correctamente', dataInsertUser)

           
                       }
            }  
 



        } catch (error) {
            console.error('Error ', error);

        }
        return ''
    }

    async close() {
        await this.connection.close();
    }
}


export default new usersService();
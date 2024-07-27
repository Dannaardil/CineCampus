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

            else {
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

    async getUser(id) {
        try {
            const db = await this.connection.connect();


            const usuarios = db.collection('usuarios');


            let operacion1 = await usuarios.find({ id: id }).toArray();

            if (operacion1.length == 0) {
                console.log(' el usuario no existe')
            }else{

                console.log('el usuario que buscas es: ')
                console.log(operacion1[0])
            }



        } catch (error) {
            console.error('Error ', error);

        }
        return ''

    }
    async updateUser(id, rol) {
        try {
            const db = await this.connection.connect();
   

            const usuarios = db.collection('usuarios');
            function generar_tarjeta() {

                return Math.floor(Math.random() * 99) + 1;

            }
            let numero_f = generar_tarjeta()


            let numero = 'VIP12345' + numero_f.toString()


            let operacion1 = await usuarios.find({ id: id }).toArray();
            let operacion2 = await usuarios.find({ "tarjeta_vip.numero": numero }).toArray();
            if (operacion2.length != 0) {
                numero_f = generar_tarjeta()
                numero = 'VIP12345' + numero_f.toString()
            }


            if (operacion1[0].rol === rol){
                console.log('el usuario ya es: ' + rol)
            }

            else if (operacion1.length == 0) {
                console.log(' el usuario no existe')
            }else if (rol === 'vip') {

                await usuarios.updateOne({ id: id }, { $set: { rol: rol, 'tarjeta_vip.estado': 'Activa', 'tarjeta_vip.numero': numero } })
                let info = await usuarios.find({ id: id }).toArray();
                console.log('el usuario vip se ha actualizado correctamente a vip y se le ha generado una tarjeta activa con este num: '+numero )
            }else if (rol === 'estandar' || rol === 'administrador') {
                if (operacion1[0].rol == 'vip') {
                    await usuarios.updateOne(
                        { id: id},
                        { $unset: { tarjeta_vip: "" } }
                    )
                    await usuarios.updateOne({ id: id }, { $set: { rol: rol } })
                    let info2 = await usuarios.find({ id: id }).toArray();
                    console.log('el usuario se ha actualizado correctamente ')
                } else {

                    await usuarios.updateOne({ id: id }, { $set: { rol: rol } })
                    
                    let info3 = await usuarios.find({ id: id }).toArray();
                    console.log('el usuario se ha actualizado correctamentep')
                }
            }
                
            
              
            



        } catch (error) {
            console.error('Error ', error);

        }
        return ''

    }
    async getUsersByRol(rol) {
        try {
            const db = await this.connection.connect();


            const usuarios = db.collection('usuarios');

           
            let operacion1 = await usuarios.find({ rol: rol }).toArray();

            
                console.log(operacion1)
           



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
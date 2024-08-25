const Connection = require('../db/connect/connect.js');

class usersService {
    constructor() {
        this.connection = new Connection();
    }
    /**
 * @description This function creates a new user in the database.
 * @param {string} id - The unique identifier for the user.
 * @param {string} nombre - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} rol - The user's role, can be 'vip', 'usuario', or 'administrador'.
 * @returns {string} Returns an empty string upon successful execution.
 * @throws {Error} Throws an error if the user already exists, the email is already registered, or the VIP card number already exists.
 * @example
 * const usersService = new usersService();
 * const result = await usersService.createAUser('123', 'John Doe', 'john.doe@example.com', 'vip');
 */
    async createAUser({id, nombre, email, rol}) {
        try {
            const db = await this.connection.connect();
            // const dbMongo = await this.connection.db('D_CineCampus')
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
                return(' el usuario ya existe o el correo ya fue registrado.')
            }

            else {
                if (rol == 'vip') {
                    await usuarios.insertOne(dataInsertVip)
                    await db.command({
                        createUser: nombre,
                        pwd: nombre + 123,
                        roles: [{ role: 'usuarioVip', db: 'D_CineCampus' }]
                    });
                    console.log('el usuario vip se ha registrado correctamente', dataInsertVip)
                    console.log('se le ha generado un numero de tarjeta vip activa su numero es ' + numero)
                }
                if (rol === 'estandar') {
                    await db.command({
                        createUser: nombre,
                        pwd: nombre + 123,
                        roles: [{ role: 'usuario_p', db: 'D_CineCampus' }]
                    });
                    await usuarios.insertOne(dataInsertUser)
                    console.log(' se ha registrado correctamente el usuario', dataInsertUser)


                }
                if (rol === 'administrador'){
                    await db.command({
                        createUser: nombre,
                        pwd: nombre + 123,
                        roles: [{ role: 'dbOwner', db: 'D_CineCampus' }]
                    });
                    await usuarios.insertOne(dataInsertUser)
                    return { success: true, message: 'Se ha registrado correctamente el admin', data: dataInsertUser }

                }

            }




        } catch (error) {
            console.error('Error ', error);

        }
        return { success: true, message: 'Se ha registrado correctamente el admin', data: dataInsertUser }
    }
  /**
 * @description This function retrieves a user by their unique id from the database.
 * @param {string} id - The unique identifier for the user.
 * @returns {Promise<string>} Returns an empty string upon successful execution.
 * @throws {Error} Throws an error if the user does not exist.
 * @example
 * const usersService = new usersService();
 * const result = await usersService.getUser('123');
 */
    async getUser({id}) {
        try {
            const db = await this.connection.connect();


            const usuarios = db.collection('usuarios');


            let operacion1 = await usuarios.find({ id: parseInt(id) }).toArray();

            if (operacion1.length == 0) {
                return(' el usuario no existe')
            }else{

                console.log('el usuario que buscas es: ')
                console.log(operacion1[0])
               return { success: true, message: 'usuario encontrado: ', info: operacion1[0]}
            }



        } catch (error) {
            console.error('Error ', error);

        }
        return { success: true, message: 'Se ha registrado correctamente el admin', oper }

    }
    async getUserByUsername({username}) {
        try {
            const db = await this.connection.connect();
            const usuarios = db.collection('usuarios');

            let user = await usuarios.findOne({ nombre: username.toString() });

            if (!user) {
                return { success: false, message: 'El usuario no existe' };
            } else {
                return { success: true, message: 'Usuario encontrado', info: user };
            }
        } catch (error) {
            console.error('Error ', error);
            throw error;
        }
    }
    /**
 * @description This function updates a user's role in the database.
 * @param {string} id - The unique identifier for the user.
 * @param {string} rol - The new role for the user. Can be 'vip', 'estandar', or 'administrador'.
 * @returns {Promise<string>} Returns an empty string upon successful execution.
 * @throws {Error} Throws an error if the user does not exist or if the new role is not valid.
 * @example
 * const usersService = new usersService();
 * const result = await usersService.updateUser('123', 'vip');
 */
    async updateUser({id, username, rol}) {
        try {
            const db = await this.connection.connect();
   

            const usuarios = db.collection('usuarios');


            
            function generar_tarjeta() {

                return Math.floor(Math.random() * 99) + 1;

            }
            let numero_f = generar_tarjeta()


            let numero = 'VIP12345' + numero_f.toString()


            let operacion1 = await usuarios.find({ id: parseInt(id) }).toArray();
            let operacion2 = await usuarios.find({ "tarjeta_vip.numero": numero }).toArray();
          

             
            if (operacion2.length != 0) {
                numero_f = generar_tarjeta()
                numero = 'VIP12345' + numero_f.toString()
            }


            if (operacion1[0].rol === rol){
                return('el usuario ya es: ' + rol)
            }

            else if (operacion1.length == 0) {
                return(' el usuario no existe')
            }else if (rol === 'vip') {


                await db.command({ 
                    dropUser: username 
                  });
                   
 
                await db.command({
                    createUser: username,
                    pwd:  username+ 123,
                    roles: [{ role: 'usuarioVip', db: 'D_CineCampus' }]
                });
                await usuarios.updateOne({ id: parseInt(id) },
                     { $set: { rol: rol, 
                    'tarjeta_vip.estado': 'Activa',
                    'tarjeta_vip.numero': numero } })

                let info =  await usuarios.find({ id: parseInt(id) }).toArray();

                return{message: 'el usuario vip se ha actualizado correctamente a vip y se le ha generado una tarjeta activa con este num: '+numero }
            }else if (rol === 'estandar' || rol === 'administrador') {
              
                  
                
                if (operacion1[0].rol == 'vip') {
                    await db.command({ 
                        dropUser: username 
                      });

                    if (rol === 'administrador'){
                        await db.command({
                            createUser: username,
                            pwd: username + 123,
                            roles: [{ role: 'dbOwner', db: 'D_CineCampus' }]
                        });
                    }
                      else if(rol === 'estandar'){
                        await db.command({
                            createUser: username,
                            pwd: username + 123,
                            roles: [{ role: 'usuario_p', db: 'D_CineCampus' }]
                        });
                      }
    
                  
                    await usuarios.updateOne(
                        { id: parseInt(id)},
                        { $unset: { tarjeta_vip: "" } }
                    )
                    await usuarios.updateOne({ id: parseInt(id) }, { $set: { rol: rol } })
                    let info2 = await usuarios.find({ id: parseInt(id) }).toArray();
                    return{message: 'el usuario se ha actualizado correctamente ', info2}
                } else { // si el usuario anteriormente no era vip y no se va a actualizar ni a admin ni a vip
                    await db.command({ 
                        dropUser: username 
                      });
                      await db.command({
                        createUser: username, 
                        pwd: username + 123,
                        roles: [{ role: 'usuario_p', db: 'D_CineCampus' }]
                    });
                     
                    await usuarios.updateOne({ id: parseInt(id) }, { $set: { rol: rol } })
                    
                    let info3 = await usuarios.find({ id: parseInt(id) }).toArray();
                    return{message: 'el usuario se ha actualizado correctamente', "info": info3}
                }
            }
                
            
              
            



        } catch (error) {
            console.error('Error ', error);

        }
        return ''

    }
    /**
 * @description This function retrieves all users with a specific role from the database.
 * @param {string} rol - The role of the users to be retrieved.
 * @returns {Promise<string>} Returns an empty string upon successful execution.
 * @throws {Error} Throws an error if the role is not valid.
 * @example
 * const usersService = new usersService();
 * const result = await usersService.getUsersByRol('vip');
 */
    async getUsersByRol({rol}) {
        try {
            const db = await this.connection.connect();


            const usuarios = db.collection('usuarios');

           
            let operacion1 = await usuarios.find({ rol: rol }).toArray();

            
                console.log(operacion1)

            return { message: "usuarios encontrados: " + operacion1}
           



        } catch (error) {
            console.error('Error ', error);

        }
        return ''
    }
    async close() {
        await this.connection.close();
    }
}


module.exports = usersService;
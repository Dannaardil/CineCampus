import Connection from '../../db/connect/connect.js';

export class projectionsService {
    constructor() {
        this.connection = Connection;
    }

    async verifySeats(proyeccion_id,asiento ) {
        try {
            const db = await this.connection.connect();
            const boletos = db.collection('boletos')
            const salas = db.collection('salas')

            let operacion5 = await boletos.find({ asiento: asiento }).toArray();
            const operacion1 = await salas.find({
                "asientos": {
                    $elemMatch: asiento
                }
            }).toArray();
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


          
        if (asientoEstaOcupado) {
            return('El asiento esta ocupado')


        }else if (operacion1.length == 0) {
            return('el asiento no existe ')

        }else{
            return 'el asiento esta disponible'
        }


          
        } catch (error) {
            console.error('Error checking movie availability:', error);

        }
        return ''
    }


    async close() {
        await this.connection.close();
    }
}


export default new projectionsService();
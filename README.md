### Proyecto: CineCampus

#### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

#### Objetivo

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.

#### Requisitos Funcionales

1. **Selección de Películas:**
   - **API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.
   - **API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.
   

      ## Descripción del Código
      La  duncion `getAllMovies` permite obtener todas las películas disponibles verificando esto por medio de la fecha de estreno y retiro, así como los horarios de proyección  y muestra informacion completa de las peliculas.

      ## Parámetros
      - No aplica. La clase no recibe parámetros directos en los métodos documentados.

      #### Retorno
      - (Array): Un arreglo de objetos que representan las películas disponibles, incluyendo detalles como título, fecha de estreno, fecha de retiro, sinopsis, género, clasificación, duración y horarios de proyección.

      #### Ejemplo de Uso
      ```javascript
      console.log(await peliculas.getAllMovies())
     
       ## Credenciales

         ```plaintext
         usuario=usuario
         contraseña=user123
         ```

   
2. **Compra de Boletos:**
   - **API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.
   - **API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

      # Función `setTicket` 

      ## Descripción del Código
      La función `setTicket` es un método asíncrono diseñado para gestionar las reservas de boletos para proyecciones de películas. Maneja la validación de disponibilidad de asientos, el estado del usuario, y procesa los pagos aplicando posibles descuentos para usuarios VIP.

      ## Parámetros
      - `proyeccion_id` (String): El ID de la proyección de la película.
      - `usuario_id` (String): El ID del usuario.
      - `asiento` (Object): El objeto del asiento que contiene los detalles del mismo.
      - `metodo_pago` (String): El método de pago.

      ## Retorno
      - (String): Un mensaje indicando el resultado de la operación (éxito o error).

      ## Ejemplo de Uso
      ```javascript
      console.log(await boletos.setTicket(2, 2, {
         'fila': 'B',
         'numero': 1,
         'tipo': 'vip'
      }, 'efectivo'))
     
  ## Credenciales

         ```plaintext
         usuario=admin
         contraseña=admin123
         ```

        

3. **Asignación de Asientos:**
   - **API para Reservar Asientos:** Permitir la selección y reserva de asientos para una proyección específica.

      ## Función `bookATicket`

      ## Descripción del Código
      La función `bookATicket` es un método asíncrono diseñado para gestionar la reserva de boletos para proyecciones de películas. Maneja la validación de disponibilidad de asientos, y procesa las reservas aplicando posibles descuentos para usuarios VIP.

      ## Parámetros
      - `proyeccion_id` (String): El ID de la proyección de la película.
      - `usuario_id` (String): El ID del usuario.
      - `asiento` (Object): El objeto del asiento que contiene los detalles del mismo.
      - `metodo_pago` (String): El método de pago.

      ## Retorno
      - (String): Un mensaje indicando el resultado de la operación (éxito o error).

      ## Ejemplo de Uso
      
      ```javascript
      console.log(await boletos.bookATicket(2, 2, {
         'fila': 'A',
         'numero': 1,
         'tipo': 'regular'
      }, 'efectivo'))


    ## Credenciales

         ```plaintext
         usuario=usuario
         contraseña=user123
         ```

   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.
    #  Función `cancelAReservation`

      ## Descripción del Código
      La función `cancelAReservation` es un método asíncrono diseñado para gestionar la cancelación de reservas de boletos para proyecciones de películas. Verifica la existencia del boleto, su estado actual y si es una reserva antes de proceder con la cancelación.

      ## Parámetros
      - `id` (Number): El ID del pago asociado con la reserva del boleto.

      ## Retorno
      - (String): Un mensaje indicando el resultado de la operación (éxito o error).

      ## Ejemplo de Uso
      ```javascript
      console.log(await boletos.cancelAReservation(74))`
      

      ## Credenciales

         ```plaintext
         usuario=usuario
         contraseña=user123
         ```
     


4. **Descuentos y Tarjetas VIP:**
   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.

      #  Descuentos y Tarjetas VIP

      ## Descripción
      La consulta 4, que incluye la creación de una funcion para aplicar descuentos y verificar la validez de una tarjeta VIP durante el proceso de compra, no se lleva a cabo de manera independiente. Esto se debe a que dicha funcionalidad ya está integrada en la función existente `setTicket`, que maneja la compra de boletos.

      ## Funcionalidad Existente en `setTicket`
      La función `setTicket` ya incorpora la lógica necesaria para aplicar descuentos y verificar la validez de las tarjetas VIP durante el proceso de compra. A continuación, se describe cómo se gestionan estos aspectos en `setTicket`:

      ### Aplicación de Descuentos
      - La función `setTicket` verifica si el usuario tiene el rol de 'vip' y si su tarjeta VIP está activa.
      - Si ambos criterios se cumplen, se aplica un descuento del 10% al precio del boleto.
      - El descuento aplicado se refleja en el precio total del boleto registrado en la base de datos.

      ### Verificación de la Tarjeta VIP
      - Durante la validación de los datos del usuario, `setTicket` verifica el estado de la tarjeta VIP.
      - La función consulta la colección `usuarios` para determinar si la tarjeta VIP está activa.
      - En caso de que la tarjeta no esté activa, el descuento no se aplica, y se notifica al usuario.


5. - Roles Definidos:
     - **Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
            # Credenciales del Rol Administrador

         ## Descripción
         Las siguientes credenciales son utilizadas para acceder al rol de administrador en la base de datos MongoDB. Estas credenciales proporcionan permisos elevados para realizar operaciones administrativas y de gestión de la base de datos.
         en el .envTemplate se encuentran las variables correspondientes a usuario y contraseña

         ## Credenciales

         ```plaintext
         usuario =administrador
         contraseña=admin123
         ``
         
       



     - **Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
     # Credenciales del Rol Usuario Estándar

      ## Descripción
      Las siguientes credenciales son utilizadas para acceder al rol de usuario estándar en la base de datos MongoDB. Estas credenciales permiten a los usuarios comprar boletos en línea sin la intervención del administrador. En el archivo `.envTemplate` se encuentran las variables correspondientes a usuario y contraseña.


   
      ## Credenciales

      ```plaintext
      usuario=usuario
      contraseña=user123
      ```





     - **Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP. (no añadido)


      ## Descripción
      Inicialmente se consideró la creación de un rol específico de **Usuario VIP** que permitiría a los usuarios comprar boletos 
      en línea con descuentos aplicables para titulares de tarjetas VIP. Sin embargo, se decidió no incluir este rol de manera separada 
      debido a la implementación actual del proceso de compra.

      ## Razón de la Decisión
      ### Gestión Unificada de Usuarios
      La funcionalidad de compra de boletos ya maneja la verificación del rol VIP y la aplicación de descuentos dentro del mismo proceso. Al no separar los roles de usuario estándar y VIP, se simplifica el flujo de compra y la gestión de usuarios. Esta unificación proporciona los siguientes beneficios:

      1. **Simplicidad en el Código:** No es necesario duplicar la lógica de compra para diferentes tipos de usuarios, reduciendo la complejidad del código.
      2. **Mantenimiento:** Un solo punto de control para las compras facilita el mantenimiento y la actualización del sistema.
      3. **Flexibilidad:** Permite la expansión futura del sistema sin necesidad de grandes modificaciones para integrar nuevos roles o condiciones especiales.

      ### Verificación durante la Compra
      Durante el proceso de compra, el sistema verifica automáticamente si el usuario tiene un rol VIP y si su tarjeta VIP está activa. Si ambas condiciones se cumplen, se aplica el descuento correspondiente al precio del boleto. Este enfoque evita la necesidad de una separación explícita de roles y garantiza que todos los usuarios, independientemente de su tipo, pasen por el mismo flujo de compra.




   - **API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).

      # Función `createAUser`

      ## Descripción
      La función `createAUser` se utiliza para crear un nuevo usuario en la base de datos MongoDB. Dependiendo del rol del usuario, puede generar una tarjeta VIP con un número único. La función verifica que el ID del usuario, el correo electrónico y el número de tarjeta VIP no existan ya en la base de datos antes de insertar el nuevo usuario.

      ## Parámetros

      - **id** (number): El ID único del usuario.
      - **nombre** (string): El nombre del usuario.
      - **email** (string): El correo electrónico del usuario.
      - **rol** (string): El rol del usuario, puede ser 'usuario', 'administrador' o 'vip'.

      ## Resultado
      - La función no devuelve un valor directamente. Imprime mensajes en la consola indicando si el usuario se ha registrado correctamente o si ya existe.

      ## Ejemplo de Uso

      ```javascript
      // Crear un usuario VIP
      console.log(await createAUser(4, 'Miguel Castro', 'miguel@gmail.com', 'vip'));

      // Crear un usuario estándar
      console.log(await createAUser(5, 'Juan Pérez', 'juan@gmail.com', 'usuario'));

      // Crear un administrador
      console.log(await createAUser(6, 'Ana López', 'ana@gmail.com', 'administrador'));
      ```

       ## Credenciales

         ```plaintext
         usuario =administrador
         contraseña=admin123
         ``
         


   - **API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.
     # Documentación de la Función `getUser`

      ## Descripción
      La función `getUser` se utiliza para obtener la información de un usuario específico de la base de datos MongoDB utilizando su ID. Si el usuario existe, la función imprime su información en la consola. Si no, informa que el usuario no existe.

      ## Parámetros

      - **id** (number): El ID único del usuario que se desea buscar.

      ## Resultado
      - Imprime mensajes en la consola indicando si el usuario existe y muestra su información o indica que el usuario no existe.

      ## Ejemplo de Uso

      ```javascript
      // Obtener la información de un usuario con ID 2
      console.log(await getUser(2));
      ```

       ## Credenciales

         ```plaintext
         usuario =administrador
         contraseña=admin123
         ``
         

         


   - **API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).
      #  Función `updateUser`

      ## Descripción
      La función `updateUser` permite actualizar el rol de un usuario en la base de datos MongoDB. Puede cambiar el rol de un usuario estándar a VIP, de VIP a administrador, o viceversa. Si el rol se cambia a VIP, se genera y asigna una nueva tarjeta VIP activa.

      ## Parámetros

      - **id** (number): El ID único del usuario que se desea actualizar.
      - **rol** (string): El nuevo rol del usuario. Puede ser 'estándar', 'vip' o 'administrador'.

      ## Resultado
      - La función no devuelve un valor directamente. Imprime mensajes en la consola indicando si el usuario se ha actualizado correctamente o si el usuario no existe.

      ## Ejemplo de Uso

      ```javascript
      // Actualizar el rol de un usuario con ID 2 a 'estándar'
      console.log(await updateUser(2, 'estándar'));

      // Actualizar el rol de un usuario con ID 3 a 'vip'
      console.log(await updateUser(3, 'vip'));

      // Actualizar el rol de un usuario con ID 3 a 'administrador'
      console.log(await updateUser(3, 'administrador'));
         ```

      ## Credenciales

         ```plaintext
         usuario =administrador
         contraseña=admin123
         ``
         



   - **API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).
      #  Función getUsersByRol`

      ## Descripción
      La función `getUsersByRol` se utiliza para obtener una lista de usuarios que tienen un rol específico en la base de datos MongoDB. Esta función imprime en la consola todos los usuarios que coinciden con el rol proporcionado.

      ## Parámetros

      - **rol** (string): El rol de los usuarios que se desean buscar. Puede ser 'estándar', 'vip' o 'administrador'.

      ## Resultado
      - La función no devuelve un valor directamente. Imprime en la consola una lista de usuarios que tienen el rol especificado.

      ## Ejemplo de Uso

      ```javascript
      // Obtener una lista de usuarios con el rol 'vip'
      console.log(await getUsersByRol('vip'));

      // Obtener una lista de usuarios con el rol 'administrador'
      console.log(await getUsersByRol('administrador'));```

       ## Credenciales

         ```plaintext
         usuario =administrador
         contraseña=admin123
         ``
         


6. **Compras en Línea:**
   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.
      - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.
      #  Función `payOnline`

   ## Descripción
   La función `payOnline` permite el procesamiento de pagos en línea para la compra de boletos de proyecciones. Además, envía la confirmación de la compra y los detalles del boleto al usuario.

   ## Parámetros

   - **proyeccion_id** (number): El ID de la proyección para la cual se desea comprar el boleto.
   - **usuario_id** (number): El ID del usuario que realiza la compra.
   - **asiento** (object): Un objeto que representa el asiento seleccionado, con propiedades `fila`, `numero` y `tipo`.
   - **metodo_pago** (string): El método de pago utilizado para la compra (por ejemplo, 'tarjeta').

   ## Resultado
   - La función no devuelve un valor directamente. Imprime en la consola mensajes sobre el estado del pago y la compra del boleto, así como la información del boleto y del pago realizado.

   ## Ejemplo de Uso

   ```javascript
   // Realizar el pago en línea para una proyección con ID 2, usuario con ID 2, asiento especificado y método de pago 'tarjeta'
   console.log(await payOnline(2, 2, { 'fila': 'B', 'numero': 2, 'tipo': 'vip' }, 'tarjeta'));```

   ## Credenciales

            ```plaintext
            usuario=usuario
            contraseña=user123
            ```

#### Requisitos Técnicos

- **Base de Datos:** Utilizar MongoDB para el almacenamiento de datos relacionados con películas, boletos, asientos, usuarios y roles.
- **Autenticación:** Implementar autenticación segura para el acceso a las APIs, utilizando roles de usuario para determinar los permisos y accesos (por ejemplo, usuarios VIP y usuarios estándar).
- **Autorización de Roles:** Asegurar que las APIs y las operaciones disponibles estén adecuadamente restringidas según el rol del usuario (por ejemplo, aplicar descuentos solo a usuarios VIP).
- **Escalabilidad:** Las APIs deben estar diseñadas para manejar un gran volumen de solicitudes concurrentes y escalar según sea necesario.
- **Documentación:** Proveer una documentación clara y completa para cada API, describiendo los endpoints, parámetros, y respuestas esperadas.

#### Entregables

1. **Código Fuente:** Repositorio en GitHub con el código de las APIs desarrolladas.
2. **Documentación de API:** Documento con la descripción detallada de cada API, incluyendo ejemplos de uso y formato de datos.
3. **Esquema de Base de Datos:** Diseño del esquema de MongoDB utilizado para almacenar la información.

#### Evaluación

- **Funcionalidad:** Cumplimiento de los requisitos funcionales establecidos.
- **Eficiencia:** Desempeño y tiempo de respuesta de las APIs.
- **Seguridad:** Implementación adecuada de medidas de seguridad, autenticación y autorización de roles.
- **Documentación:** Claridad y exhaustividad de la documentación proporcionada.
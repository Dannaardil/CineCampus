

### Proyecto: CineCampus


CineCampus is a web application for a movie theater that allows users to browse movies, purchase tickets, and manage seating reservations. This project implements a backend API using Express.js and MongoDB, along with a frontend user interface.

## Project Structure



#### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

#### Objetivo

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.


#### Estructura
```
public/
├── js/
│   ├── module/
│   │   └── ticket.js
│   └── movieService.js
└── views/
├── asientos.html
├── boughtTicket.html
├── home.html
├── pagos.html
├── peliculas.html
├── ticket.html
└── index.html
server/
├── db/
├── module/
│   ├── boletos.js
│   ├── pagos.js
│   ├── peliculas.js
│   ├── proyecciones.js
│   ├── salas.js
│   ├── testConnection.js
│   └── usuarios.js
└── routes/
├── asientos.routes.js
├── boletos.routes.js
├── pagos.routes.js
├── peliculas.routes.js
└── usuarios.routes.js
.env
.envTemplate
.gitignore
app.js
main.js
package.json
README.md

```


## Features

- Browse available movies
- Purchase tickets online
- Select and reserve seats
- Apply discounts for VIP users
- Manage user roles (standard, VIP, admin)
- Process online payments

## Technologies Used

- Backend: Node.js, Express.js
- Database: MongoDB
- Frontend: HTML, CSS, JavaScript
- Additional libraries: Axios, Swiper

## Setup and Installation

1. Clone the repository: git clone https://github.com/Dannaardil/ExamenEncriptador.git

2. Install dependencies: npm install

3. Set up environment variables:
- Copy `.envTemplate` to `.env`
- Fill in the required environment variables

4. Start the server: npm run app

## API Documentation

The API is organized into several route files, each handling different aspects of the application. Below is a summary of the available endpoints:

### Seats Routes

- `GET /seats/:projectionId`: Get available seats for a specific projection
- `GET /seats/all/:projectionId`: Get all seats for a specific projection
- `GET /seats/withAvailability/:movieId`: Get all seats with availability for a specific movie
- `GET /api/seats/`: Get all available seats
- `GET /api/projections/:movieId`: Get projections for a specific movie
- `GET /api/projections/week/:movieId`: Get projections for a specific movie for the current week
- `GET /api/sala/:salaId`: Get details of a specific theater room

### Tickets Routes

- `POST /setTicket`: Create a new ticket
- `PATCH /cancel/:id`: Cancel a reservation

### Payments Routes

- `POST /payment`: Process a payment for a ticket

### Movies Routes

- `GET /v1`: Get all available movies
- `GET /v2`: Get upcoming movies
- `GET /:id`: Get details of a specific movie

### Users Routes

- `POST /users/create`: Create a new user
- `GET /users/get/:username`: Get user by username
- `GET /users/get/:id`: Get user by ID
- `PATCH /users/update`: Update user information
- `GET /users/getByRol/:rol`: Get users by role
- `GET /config`: Get configuration information
- `POST /api/user-tickets`: Get tickets for a specific user

### Main Application Routes (app.js)

- `GET /movies`: Serve the home page
- `GET /movie/:id`: Serve the individual movie page
- `GET /seat/:projectionId`: Serve the seat selection page
- `GET /all/`: Serve the payments page
- `GET /bTicket/`: Serve the bought ticket page
- `GET /ticket/`: Serve the ticket information page

For detailed information on request and response formats, please refer to the individual route files in the `server/routes/` directory.

## User Roles

- **Standard User**: Can browse movies and purchase tickets online
- **VIP User**: Enjoys discounts on ticket purchases
- **Admin**: Has full system management capabilities, including on-site ticket sales

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

#### Functional Requirements

1. **Movie Selection:**
   - **API to List Movies:** Allow querying all available movies in the catalog, with details such as title, genre, duration, and showtimes.
   - **API to Get Movie Details:** Allow querying detailed information about a specific movie, including synopsis.

      ## Code Description
      The `getAllMovies` function allows obtaining all available movies by checking their release and withdrawal dates, as well as showtimes, and displays complete information about the movies.

      ## Parameters
      - Not applicable. The class does not receive direct parameters in the documented methods.

      #### Return
      - (Array): An array of objects representing available movies, including details such as title, release date, withdrawal date, synopsis, genre, rating, duration, and showtimes.

      #### Usage Example
      ```javascript
      console.log(await peliculas.getAllMovies())

       ## Credentials

         ```plaintext
         user=usuario
         password=user123
         ```

2. **Ticket Purchase:**
   - **API to Purchase Tickets:** Allow the purchase of tickets for a specific movie, including the selection of date and time of the screening.

      # `setTicket` Function 

      ## Code Description
      The `setTicket` function is an asynchronous method designed to manage ticket reservations for movie screenings. It handles seat availability validation, user status, and processes payments applying possible discounts for VIP users.

      ## Parameters
      - `projection_id` (String): The ID of the movie screening.
      - `user_id` (String): The user ID.
      - `seat` (Object): The seat object containing seat details.
      - `payment_method` (String): The payment method.

      ## Return
      - (String): A message indicating the result of the operation (success or error).

      ## Usage Example
      ```javascript
      console.log(await boletos.setTicket(2, 2, {
         'row': 'B',
         'number': 1,
         'type': 'vip'
      }, 'cash'))

  ## Credentials

         ```plaintext
         user=admin
         password=admin123
         ```
 - **API to Verify Seat Availability:** Allow querying the availability of seats in a room for a specific screening.

  ## Usage Example
      ```javascript
      console.log(await proyecciones.verifySeats(1, {
       row:"C",
       number:2,
       type:"vip"
       })) 

3. **Seat Assignment:**
   - **API to Reserve Seats:** Allow the selection and reservation of seats for a specific screening.

      ## `bookATicket` Function

      ## Code Description
      The `bookATicket` function is an asynchronous method designed to manage ticket reservations for movie screenings. It handles seat availability validation and processes reservations applying possible discounts for VIP users.

      ## Parameters
      - `projection_id` (String): The ID of the movie screening.
      - `user_id` (String): The user ID.
      - `seat` (Object): The seat object containing seat details.
      - `payment_method` (String): The payment method.

      ## Return
      - (String): A message indicating the result of the operation (success or error).

      ## Usage Example

      ```javascript
      console.log(await boletos.bookATicket(2, 2, {
         'row': 'A',
         'number': 2,
         'type': 'regular'
      }, 'cash'))

    ## Credentials

         ```plaintext
         user=usuario
         password=user123
         ```

   - **API to Cancel Seat Reservation:** Allow the cancellation of an already made seat reservation.
    #  `cancelAReservation` Function

      ## Code Description
      The `cancelAReservation` function is an asynchronous method designed to manage the cancellation of ticket reservations for movie screenings. It verifies the existence of the ticket, its current status, and if it's a reservation before proceeding with the cancellation.

      ## Parameters
      - `id` (Number): The ID of the payment associated with the ticket reservation.

      ## Return
      - (String): A message indicating the result of the operation (success or error).

      ## Usage Example
      ```javascript
      console.log(await boletos.cancelAReservation(41))

      ## Credentials

         ```plaintext
         user=usuario
         password=user123
         ```

4. **Discounts and VIP Cards:**
   - **API to Apply Discounts:** Allow the application of discounts on ticket purchases for users with VIP cards.
   - **API to Verify VIP Card:** Allow verification of the validity of a VIP card during the purchase process.

      #  Discounts and VIP Cards

      ## Description
      Query 4, which includes creating a function to apply discounts and verify the validity of a VIP card during the purchase process, is not carried out independently. This is because this functionality is already integrated into the existing `setTicket` function, which handles ticket purchases.

      ## Existing Functionality in `setTicket`
      The `setTicket` function already incorporates the necessary logic to apply discounts and verify the validity of VIP cards during the purchase process. Here's how these aspects are managed in `setTicket`:

      ### Discount Application
      - The `setTicket` function checks if the user has the 'vip' role and if their VIP card is active.
      - If both criteria are met, a 10% discount is applied to the ticket price.
      - The applied discount is reflected in the total ticket price recorded in the database.

      ### VIP Card Verification
      - During user data validation, `setTicket` verifies the status of the VIP card.
      - The function queries the `users` collection to determine if the VIP card is active.
      - If the card is not active, the discount is not applied, and the user is notified.

5. - Defined Roles:
     - **Administrator:** Has full permissions to manage the system, including selling tickets at the physical location. Administrators are not involved in online purchases made by users.
            # Administrator Role Credentials

         ## Description
         The following credentials are used to access the administrator role in the MongoDB database. These credentials provide elevated permissions to perform administrative and database management operations.
         The corresponding variables for username and password can be found in the .envTemplate file.

         ## Credentials

         ```plaintext
         user=administrador
         password=admin123
         ```

     - **Standard User:** Can purchase tickets online without administrator intervention.
     # Standard User Role Credentials

      ## Description
      The following credentials are used to access the standard user role in the MongoDB database. These credentials allow users to purchase tickets online without administrator intervention. The corresponding variables for username and password can be found in the .envTemplate file.

      ## Credentials

      ```plaintext
      user=usuario
      password=user123
      ```

     - **VIP User:** Can purchase tickets online with applicable discounts for VIP cardholders. 
         ## Credentials

      ```plaintext
      user=usuarioVip
      password=usuarioVip123
      ```

   - **API to Create User:** Allow the creation of new users in the system, assigning specific roles and privileges (standard user, VIP user, or administrator).

      # `createAUser` Function

      ## Description
      The `createAUser` function is used to create a new user in the MongoDB database. Depending on the user's role, it may generate a VIP card with a unique number. The function verifies that the user ID, email, and VIP card number do not already exist in the database before inserting the new user.

      ## Parameters

      - **id** (number): The unique user ID.
      - **name** (string): The user's name.
      - **email** (string): The user's email address.
      - **role** (string): The user's role, can be 'usuario', 'administrador', or 'vip'.

      ## Result
      - The function does not return a value directly. It prints messages to the console indicating whether the user has been registered successfully or if they already exist.

      ## Usage Example

      ```javascript
      // Create a VIP user
      console.log(await createAUser(4, 'Miguel Castro', 'miguel@gmail.com', 'vip'));

      // Create a standard user
      console.log(await createAUser(5, 'Juan Pérez', 'juan@gmail.com', 'usuario'));

      // Create an administrator
      console.log(await createAUser(6, 'Ana López', 'ana@gmail.com', 'administrador'));
      ```

       ## Credentials

         ```plaintext
         user=administrador
         password=admin123
         ```

   - **API to Get User Details:** Allow querying detailed information about a user, including their role and VIP card status.
     # Documentation for `getUser` Function

      ## Description
      The `getUser` function is used to obtain information about a specific user from the MongoDB database using their ID. If the user exists, the function prints their information to the console. If not, it reports that the user does not exist.

      ## Parameters

      - **id** (number): The unique ID of the user to be searched for.

      ## Result
      - Prints messages to the console indicating whether the user exists and displays their information or indicates that the user does not exist.

      ## Usage Example

      ```javascript
      // Get information for a user with ID 2
      console.log(await getUser(2));
      ```

       ## Credentials

         ```plaintext
         user=administrador
         password=admin123
         ```

   - **API to Update User Role:** Allow updating a user's role (for example, changing from standard user to VIP, or vice versa).
      #  `updateUser` Function

      ## Description
      The `updateUser` function allows updating a user's role in the MongoDB database. It can change a user's role from standard to VIP, from VIP to administrator, or vice versa. If the role is changed to VIP, a new active VIP card is generated and assigned.

      ## Parameters

      - **id** (number): The unique ID of the user to be updated.
      - **role** (string): The new role for the user. Can be 'standard', 'vip', or 'administrator'.

      ## Result
      - The function does not return a value directly. It prints messages to the console indicating whether the user has been updated successfully or if the user does not exist.

      ## Usage Example

      ```javascript
      // console.log(await usuarios.updateUser(7, 'Henry Boada', 'vip')) // 

         ```

      ## Credentials

         ```plaintext
         user=administrador
         password=admin123
         ```

   - **API to List Users:** Allow querying all users in the system, with the ability to filter by role (VIP, standard, or administrator).
      #  `getUsersByRol` Function

      ## Description
      The `getUsersByRol` function is used to obtain a list of users who have a specific role in the MongoDB database. This function prints to the console all users that match the provided role.

      ## Parameters

      - **role** (string): The role of the users to be searched for. Can be 'standard', 'vip', or 'administrator'.

      ## Result
      - The function does not return a value directly. It prints to the console a list of users who have the specified role.

      ## Usage Example

      ```javascript
      // Get a list of users with the 'vip' role
      console.log(await getUsersByRol('vip'));

      // Get a list of users with the 'administrator' role
      console.log(await getUsersByRol('administrator'));```

       ## Credentials

         ```plaintext
         user=administrador
         password=admin123
         ```


6. **Online Purchases:**
   - **API to Process Payments:** Allow the processing of online payments for ticket purchases.
      - **API for Purchase Confirmation:** Send purchase confirmation and ticket details to the user.
      #  `payOnline` Function

   ## Description
   The `payOnline` function allows the processing of online payments for ticket purchases for screenings. Additionally, it sends the purchase confirmation and ticket details to the user.

   ## Parameters

   - **projection_id** (number): The ID of the projection for which the ticket is being purchased.
   - **user_id** (number): The ID of the user making the purchase.
   - **seat** (object): An object representing the selected seat, with properties `row`, `number`, and `type`.
   - **payment_method** (string): The payment method used for the purchase (for example, 'card').

   ## Result
   - The function does not return a value directly. It prints messages to the console about the payment status and ticket purchase, as well as information about the ticket and the payment made.

   ## Usage Example

   ```javascript
   // Process an online payment for a projection with ID 2, user with ID 2, specified seat, and 'card' payment method
   console.log(await payOnline(2, 2, { 'row': 'B', 'number': 2, 'type': 'vip' }, 'card'));

   ## Credentials

            ```plaintext
            usuario=usuario
            contraseña=user123
            ```

#### Technical Requirements

- **Database:** Use MongoDB for storing data related to movies, tickets, seats, users, and roles.
- **Authentication:** Implement secure authentication for API access, using user roles to determine permissions and access (for example, VIP users and standard users).
- **Role Authorization:** Ensure that APIs and available operations are appropriately restricted according to the user's role (for example, apply discounts only to VIP users).
- **Scalability:** The APIs should be designed to handle a large volume of concurrent requests and scale as needed.
- **Documentation:** Provide clear and complete documentation for each API, describing the endpoints, parameters, and expected responses.

#### Deliverables

1. **Source Code:** GitHub repository with the code of the developed APIs.
2. **API Documentation:** Document with detailed description of each API, including usage examples and data format.
3. **Database Schema:** Design of the MongoDB schema used to store the information.

#### Evaluation

- **Functionality:** Fulfillment of established functional requirements.
- **Efficiency:** Performance and response time of the APIs.
- **Security:** Proper implementation of security measures, authentication, and role authorization.
- **Documentation:** Clarity and thoroughness of the provided documentation.
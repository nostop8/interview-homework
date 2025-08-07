# Express API for Warehouse app

This app was extended to include a product management API as per requirements. It allows users to perform CRUD operations on products, which are defined by their ID, name, quantity, and unit price in euros.

The API is built using Express.js and Prisma / SQlite, with Zod for input validation. It includes integration tests using Jest, Supertest and test instance of SQlite database to ensure the functionality of the product endpoints.

## Instructions

1. Clone the repository.
2. Navigate to the `backend` directory.
3. Install the dependencies using `npm install`.
4. Set up the dev database by running `npx prisma db push`.
   - This will create the necessary table in the SQLite database.
   - The database file is located at `prisma/dev.db`.
4. Start the application using `npm start` and query the API endpoints using Postman or curl.
   - The application will run on `http://localhost:3000`.
   - The product endpoints are available at `/products` URI.
   - You can use the provided test database for testing.
5. Run the tests using `npm test`, this will use the test database located at `prisma/test.db`.

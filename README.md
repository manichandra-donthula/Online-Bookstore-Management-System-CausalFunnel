# Online-Bookstore-Management-System-CausalFunnel

This project is an online bookstore API where users can register, login, view books, authors, and place orders. The API is built with a modern tech stack and follows RESTful principles.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **API Documentation**: Swagger UI, Swagger JSdoc
- **Other Technologies**:
  - JWT for user authentication
  - Mongoose for interacting with MongoDB
  - RESTful architecture for API endpoints

## Setting Up the Project

### Prerequisites

Before setting up the project, ensure that you have the following installed:

- **Node.js** (v14 or later) – [Download Node.js](https://nodejs.org/en/download/)
- **MongoDB** – [Install MongoDB](https://www.mongodb.com/try/download/community) or use MongoDB Atlas for a cloud-based solution.

### Installation

1. **Clone the repository**:

    ```bash
    git clone <URL of this Repository>
    cd online-bookstore-api
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure your environment variables such as:

    ```bash
    DB_URI=mongodb://localhost:27017/online-bookstore
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the application**:

    ```bash
    npm start
    ```

    The application will now be running at `http://localhost:3000`.

## API Documentation

To view the full API documentation and instructions on how to use the endpoints, refer to the Swagger UI:

1. Start the server (`npm start`).
2. Open your browser and visit `http://localhost:3000/api-docs` to explore all available API endpoints.

### Authentication

Before making requests to protected endpoints, you need to authenticate by logging in:

1. Use the `/auth/login` endpoint to get a JWT token by providing your username and password.
2. Copy the token you receive and click the **Authorize** button at the top right of the Swagger UI.
3. Paste the token into the "Value" field under the **Authorization** header and click **Authorize**.
4. After authorization, you will be able to interact with the protected API endpoints.

## API Endpoints

### Signin/Signup:

- `/auth/register` – Register a new user
- `/auth/login` – Login and receive a JWT token

### Books:

- `/books` – Get all books
- `/books/{id}` – Get a single book by ID
- `/books` (POST) – Create a new book
- `/books/{id}` (PUT) – Update a book
- `/books/{id}` (DELETE) – Delete a book

### Authors:

- `/authors` – Get all authors
- `/authors/{id}` – Get a single author by ID
- `/authors` (POST) – Create a new author
- `/authors/{id}` (PUT) – Update an author
- `/authors/{id}` (DELETE) – Delete an author

### Orders:

- `/orders` (POST) – Place an order
- `/orders` (GET) – Get all orders

Refer to the API documentation in the Swagger UI for further details on each endpoint, request parameters, and response formats.

## Challenges Faced and How I Overcame Them

1. **Integrating JWT Authentication**:
   - Challenge: Understanding and implementing JWT for securing protected routes was initially challenging.
   - Solution: I referred to official documentation and tutorials on how JWT works and implemented middleware to validate tokens seamlessly.

2. **Setting Up Swagger Documentation**:
   - Challenge: Creating clear and organized API documentation with Swagger required learning its configuration syntax.
   - Solution: By following Swagger's official guide and examples, I structured the documentation with detailed endpoints and categorized them for better usability.

3. **Handling Complex MongoDB Relationships**:
   - Challenge: Managing relationships between books, authors, and orders required understanding Mongoose's population and referencing.
   - Solution: I carefully defined schemas with proper references and used `populate()` to simplify data retrieval.

4. **Error Handling and Validation**:
   - Challenge: Ensuring robust error handling for invalid inputs and edge cases was time-consuming.
   - Solution: I implemented centralized error handling middleware and added validation using libraries like `Joi`.

5. **Managing Development Environment Variables**:
   - Challenge: Keeping sensitive data like database URIs and JWT secrets secure.
   - Solution: Used `.env` files to store sensitive information and ensured they were excluded from version control using `.gitignore`.

Each of these challenges provided valuable learning experiences,making the application more robust and secure.
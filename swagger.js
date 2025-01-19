const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Bookstore API",
      version: "1.0.0",
      description: `
        This is the documentation for the Online Bookstore API. 
        Below are the instructions to authenticate and interact with the API endpoints:
        
        **Signup and Authentication:**
        1. To access the API, you first need to sign up if you don't already have an account.
        2. Use the \`/auth/register\` endpoint to create a new account by providing your username, email, and password.
        3. After signing up successfully, use the \`/auth/login\` endpoint to get a token by providing your username and password.
        4. After logging in successfully, you will receive a **JWT token**.
        5. Copy the token you receive and click on the **Authorize** button at the bottom right of the Swagger UI.
        6. Paste the token into the "Value" field under the "Authorization" header and click **Authorize**.
        7. This will grant you access to the protected API routes.
        
        **Using API Endpoints:**
        1. The available API endpoints are organized by category (e.g., Books, Authors, Orders).
        2. To view the operations for each category, click on the category (e.g., "Books") to expand the list of available endpoints.
        3. Each endpoint provides a description of its functionality, including the method (GET, POST, PUT, DELETE) and any required parameters.
        
        **To Make a Request:**
        1. For **POST requests**, provide the necessary data in the request body in JSON format. This will be the data you want to send to the API.
        2. For **GET requests**, you do not need to provide any data. Simply click the **Try it out** button to expand the fields and then click **Execute** to see the results.
        3. For **PUT** and **DELETE** requests, provide the necessary data (such as updated information or an ID) and click **Try it out** to see the fields. Then, click **Execute** to send the request.
        
        **Step-by-Step for API Testing:**
        1. Click on the **Try it out** button to enable input fields for the request.
        2. Fill in the necessary fields with the required data (e.g., username, password, book details, etc.).
        3. Once the fields are filled, click **Execute** to make the API call.
        4. After executing, the response will appear below, showing the status code and any returned data or error messages.
        
        **Example Request for Signup:**
        - **Endpoint**: \`/auth/register\`
        - **Method**: \`POST\`
        - **Body**:
          \`\`\`json
          {
            "username": "your_username",
            "email": "your_email@example.com",
            "password": "your_password"
          }
          \`\`\`
        
        **Example Request for Login:**
        - **Endpoint**: \`/auth/login\`
        - **Method**: \`POST\`
        - **Body**:
          \`\`\`json
          {
            "username": "your_username",
            "password": "your_password"
          }
          \`\`\`
        
        **Authorization Header Format**:
        - Once logged in, use the token to authorize each request.
        - The Authorization header should look like:
          \`\`\`
          Authorization: Bearer <your_token_here>
          \`\`\`

        **Note**: Ensure that you have signed up, logged in, and added the authorization token before using protected endpoints.
      `,
    },
    // Define security scheme (JWT)
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Expected JWT format
        }
      },
    },
    // Global security requirement (optional)
    security: [
      {
        BearerAuth: [],
      }
    ],
  },
  apis: ["./routes/**/*.js", "./controllers/**/*.js"], // Path to API routes and controllers
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test Route
app.get("/", (req, res) => {
  res.send(`
    <h1>Online Bookstore API Server is running! This is Home Page!!</h1>
    <p>Click <a href="/api-docs">here</a> to view the API Endpoints and Documentation.</p>
  `);
});

// Routes
app.use("/books", require("./routes/book"));
app.use("/authors", require("./routes/author"));
app.use("/orders", require("./routes/order"));
app.use("/auth", require("./routes/auth"));

// For unmatched routes
app.use((req, res, next) => {
  res.status(404).send("Page not found. Please check the URL.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});

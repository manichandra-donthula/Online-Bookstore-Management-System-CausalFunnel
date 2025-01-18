const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running! This is Home Page!!");
});

// Routes
app.use("/books", require("./routes/book"));
app.use("/authors", require("./routes/author"));
app.use("/orders", require("./routes/order"));

// For unmatched routes
app.use((req, res, next) => {
  res.status(404).send("Page not found. Please check the URL.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});

const express = require("express");
const cors = require("cors");
const checkJwt = require("./middleware/auth");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Platformatory Profile API" });
});

// Protected routes
app.use("/api/profile", checkJwt, userRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

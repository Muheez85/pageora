const express = require("express");
const cors = require("cors");

const app = express();
const testRoutes = require("./routes/testRoutes");
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authorRoutes = require("./routes/authorRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);
app.use("/api/books",bookRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes)
// Test route

app.get("/", (req, res) => {
  res.json({
    message: "Pageora API is running",
  });
});

module.exports = app;
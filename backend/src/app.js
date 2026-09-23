const express = require("express");
const cors = require("cors");

const app = express();
const testRoutes = require("./routes/testRoutes");
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authorRoutes = require("./routes/authorRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const adminBookRoutes = require("./routes/admin/adminBookRoutes");
// Middleware

console.log("ROUTE TYPES:", {
  testRoutes: typeof testRoutes,
  bookRoutes: typeof bookRoutes,
  categoryRoutes: typeof categoryRoutes,
  authorRoutes: typeof authorRoutes,
  cartRoutes: typeof cartRoutes,
  authRoutes: typeof authRoutes,
  orderRoutes: typeof orderRoutes,
  shippingRoutes: typeof shippingRoutes,
  paymentRoutes: typeof paymentRoutes,
  userRoutes: typeof userRoutes,
  addressRoutes: typeof addressRoutes,
  settingsRoutes: typeof settingsRoutes,
  wishlistRoutes: typeof wishlistRoutes,
  adminRoutes: typeof adminRoutes,
  adminBookRoutes: typeof adminBookRoutes,
});
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);
app.use("/api/books",bookRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/addresses", addressRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/wishlist", wishlistRoutes);



app.use("/api/admin", adminRoutes);
app.use("/api/admin/books", adminBookRoutes);
// Test route

app.get("/", (req, res) => {
  res.json({
    message: "Pageora API is running",
  });
});

module.exports = app;
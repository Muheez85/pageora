import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment"; 
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";

// Admin
import AdminRoute from "./components/admin/AdminRoute";
import Admin from "./pages/Admin";

const App = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<Home />} />

          <Route path="/books" element={<Books />} />

          <Route path="/books/:slug" element={<BookDetails />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/orders/:id" element={<OrderDetails />} />

          <Route path="/payment/:id" element={<Payment />} />

          <Route path="/wishlist" element={<Wishlist />} />

          {/* Account */}
          <Route path="/account" element={<Account />} />

          <Route path="/account/profile" element={<Profile />}/>

          <Route path="/account/addresses" element={<Addresses />} />

          <Route  path="/account/settings" element={<Settings />}/>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<Admin />}/>
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
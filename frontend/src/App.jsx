import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
// import Categories from "./pages/Categories";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/orderDetails";
import Payment from "./pages/payment";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";

import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";    
function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          {/* <Route path="/categories" element={<Categories />} /> */}
          <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<SignUp/>} />
            <Route path="/cart" element={<Cart />} />
          <Route path="/books/:slug" element={<BookDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/payment/:id"element={<Payment />}/>
          <Route path="/account" element={<Account />} />
          <Route path="/account/profile" element={<Profile/>} />
           <Route path="/account/addresses" element={<Addresses/>} />
           <Route
  path="/account/settings"
  element={<Settings />}
/>
<Route
  path="/orders"
  element={<Orders />}
/>
<Route
  path="/categories"
  element={<Categories />}
/>
        <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
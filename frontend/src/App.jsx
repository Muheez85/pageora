import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
// import Categories from "./pages/Categories";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Cart from "./pages/Cart";
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
        </Routes>
      </main>
    </>
  );
}

export default App;
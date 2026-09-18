import { useEffect, useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import { getWishlist } from "../services/wishlistService";
const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

const { cartCount, fetchCart } = useCartStore();


  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);
useEffect(() => {
  if (isLoggedIn) {
    fetchCart();
  }
}, [isLoggedIn, fetchCart]);
  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    if (!query) return;

    navigate(`/books?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
    setSearchTerm("");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
useEffect(() => {
  const loadWishlistCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistCount(0);
      return;
    }

    try {
      const wishlist = await getWishlist();

      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error("GET WISHLIST COUNT ERROR:", error);
      setWishlistCount(0);
    }
  };

  loadWishlistCount();
}, []);
  return (
    <header className="border-b border-[#DED8CC] bg-[#FFFDF8]">
      <div className="container mx-auto px-6">

        {/* Main Navbar */}
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl font-bold tracking-tight text-[#124C3B]"
          >
            PAGEORA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
            >
              Home
            </Link>

            <Link
              to="/books"
              className="text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
            >
              Books
            </Link>

            <Link
              to="/categories"
              className="text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
            >
              Categories
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Search */}
            <button
              type="button"
              aria-label="Search books"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#17211D] transition hover:text-[#E86A2A]"
            >
              {searchOpen ? (
                <X size={21} strokeWidth={1.8} />
              ) : (
                <Search size={21} strokeWidth={1.8} />
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-2 text-sm text-[#17211D] transition hover:text-[#E86A2A]"
            >
              Wishlist

              {wishlistCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E86A2A] px-1.5 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {/* Cart */}
            <button
              type="button"
              aria-label="Shopping bag"
              onClick={() => navigate("/cart")}
              className="relative p-2 text-[#17211D] transition hover:text-[#E86A2A]"
            >
              <ShoppingBag size={21} strokeWidth={1.8} />

              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E86A2A] text-xs font-semibold text-white">
                {cartCount}
              </span>
            </button>

            {/* Authentication */}
            {isLoggedIn ? (
              <Link
                to="/account"
                aria-label="Account"
                className="p-2 text-[#17211D] transition hover:text-[#E86A2A]"
              >
                <UserRound size={21} strokeWidth={1.8} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-4xl border border-[#124C3B] px-4 py-2 text-sm font-medium text-[#124C3B] transition hover:bg-[#124C3B] hover:text-white"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Search - stays outside menu */}
            <button
              type="button"
              aria-label="Search books"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#17211D] transition hover:text-[#E86A2A]"
            >
              {searchOpen ? (
                <X size={22} strokeWidth={1.8} />
              ) : (
                <Search size={22} strokeWidth={1.8} />
              )}
            </button>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen ? "Close menu" : "Open menu"
              }
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded border border-[#17211D] text-[#17211D] transition hover:bg-[#124C3B] hover:text-white"
            >
              {mobileMenuOpen ? (
                <X size={23} strokeWidth={1.8} />
              ) : (
                <Menu size={23} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Search Panel */}
        {searchOpen && (
          <div className="border-t border-[#DED8CC] py-4">
            <form
              onSubmit={handleSearch}
              className="flex gap-3"
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books, authors..."
                autoFocus
                className="w-full rounded-4xl border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none focus:border-[#124C3B]"
              />

              <button
                type="submit"
                className="rounded-4xl bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#DED8CC] py-6 md:hidden">

            {/* Navigation */}
            <nav className="flex flex-col">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="border-b border-[#DED8CC] py-4 text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
              >
                Home
              </Link>

              <Link
                to="/books"
                onClick={closeMobileMenu}
                className="border-b border-[#DED8CC] py-4 text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
              >
                Books
              </Link>

              <Link
                to="/categories"
                onClick={closeMobileMenu}
                className="border-b border-[#DED8CC] py-4 text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
              >
                Categories
              </Link>
            </nav>

            {/* User Actions */}
            <div className="mt-2 flex flex-col">

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/wishlist");
                }}
                className="flex items-center gap-3 border-b border-[#DED8CC] py-4 text-left text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
              >
                <Heart size={19} strokeWidth={1.8} />
                Wishlist
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/cart");
                }}
                className="flex items-center justify-between border-b border-[#DED8CC] py-4 text-left text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={19} strokeWidth={1.8} />
                  Cart
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E86A2A] text-xs font-semibold text-white">
                  {cartCount}
                </span>
              </button>

              {/* Account / Sign In */}
              {isLoggedIn ? (
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-4 text-sm font-medium text-[#17211D] transition hover:text-[#E86A2A]"
                >
                  <UserRound size={19} strokeWidth={1.8} />
                  Account
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-4 flex items-center justify-center rounded-4xl border border-[#124C3B] py-3 text-sm font-medium text-[#124C3B] transition hover:bg-[#124C3B] hover:text-white"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
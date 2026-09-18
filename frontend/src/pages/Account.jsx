import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Settings,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

const Account = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="border-b border-[#DED8CC] pb-8">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#E86A2A]">
            My account
          </p>

          <h1 className="mt-3 text-4xl text-[#124C3B] sm:text-5xl">
            Welcome back
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            Manage your personal information, delivery
            addresses, orders, and account settings.
          </p>
        </div>

        {/* Account sections */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          {/* Profile */}
          <Link
            to="/account/profile"
            className="group border border-[#DED8CC] bg-[#FFFDF8] p-6 transition hover:border-[#124C3B]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
                <User size={21} strokeWidth={1.8} />
              </div>

              <ChevronRight
                size={20}
                className="text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
              />
            </div>

            <h2 className="mt-6 text-2xl text-[#124C3B]">
              Personal information
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6F756F]">
              View and update your name and email address.
            </p>
          </Link>

          {/* Addresses */}
          <Link
            to="/account/addresses"
            className="group border border-[#DED8CC] bg-[#FFFDF8] p-6 transition hover:border-[#124C3B]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
                <MapPin size={21} strokeWidth={1.8} />
              </div>

              <ChevronRight
                size={20}
                className="text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
              />
            </div>

            <h2 className="mt-6 text-2xl text-[#124C3B]">
              Addresses
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6F756F]">
              Manage your delivery addresses for future orders.
            </p>
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="group border border-[#DED8CC] bg-[#FFFDF8] p-6 transition hover:border-[#124C3B]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
                <ShoppingBag size={21} strokeWidth={1.8} />
              </div>

              <ChevronRight
                size={20}
                className="text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
              />
            </div>

            <h2 className="mt-6 text-2xl text-[#124C3B]">
              My orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6F756F]">
              View your order history and track your purchases.
            </p>
          </Link>

          {/* Settings */}
          <Link
            to="/account/settings"
            className="group border border-[#DED8CC] bg-[#FFFDF8] p-6 transition hover:border-[#124C3B]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
                <Settings size={21} strokeWidth={1.8} />
              </div>

              <ChevronRight
                size={20}
                className="text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
              />
            </div>

            <h2 className="mt-6 text-2xl text-[#124C3B]">
              Account settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6F756F]">
              Manage your password and account preferences.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Account;
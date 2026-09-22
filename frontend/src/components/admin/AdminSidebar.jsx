import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Users,
  ShoppingBag,
  UserRound,
  Truck,
  Settings,
  LogOut,
  Store,
  UserCircle,
  X,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();

    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      path: "/admin/books",
      icon: BookOpen,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: FolderOpen,
    },
    {
      label: "Authors",
      path: "/admin/authors",
      icon: Users,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: UserRound,
    },
    {
      label: "Shipping",
      path: "/admin/shipping",
      icon: Truck,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen w-72
        border-r border-pageora-border
        bg-pageora-surface
        transition-transform duration-300 ease-in-out

        lg:z-40
        lg:block
        lg:w-64
        lg:translate-x-0

        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      <div className="flex h-full flex-col p-5 sm:p-6">
        {/* BRAND */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-pageora-green">
              Pageora
            </h1>

            <p className="mt-1 text-xs text-pageora-muted">
              Admin Panel
            </p>
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-pageora-muted transition hover:bg-pageora-background hover:text-pageora-text lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-pageora-green text-white"
                      : "text-pageora-muted hover:bg-pageora-background hover:text-pageora-text"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* STORE LINKS */}
        <div className="mt-auto space-y-1 border-t border-pageora-border pt-4">
          <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-pageora-muted">
            Store
          </p>

          {/* BACK TO STORE */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-pageora-muted transition-colors hover:bg-pageora-background hover:text-pageora-text"
          >
            <Store size={18} />
            Back to Store
          </Link>

          {/* MY ACCOUNT */}
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-pageora-muted transition-colors hover:bg-pageora-background hover:text-pageora-text"
          >
            <UserCircle size={18} />
            My Account
          </Link>

          {/* SIGN OUT */}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
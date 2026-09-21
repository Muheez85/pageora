import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Users,
  ShoppingBag,
  UserRound,
  Star,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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
      label: "Reviews",
      path: "/admin/reviews",
      icon: Star,
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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[var(--pageora-border)] bg-[var(--pageora-surface)] lg:block">
      <div className="flex h-full flex-col p-6">
        {/* BRAND */}

        <div>
          <h1 className="text-3xl text-[var(--pageora-green)]">
            Pageora
          </h1>

          <p className="mt-1 text-xs text-[var(--pageora-muted)]">
            Admin Panel
          </p>
        </div>

        {/* NAVIGATION */}

        <nav className="mt-10 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--pageora-green)] text-white"
                      : "text-[var(--pageora-muted)] hover:bg-[var(--pageora-background)] hover:text-[var(--pageora-text)]"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* SIGN OUT */}

        <button
          type="button"
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
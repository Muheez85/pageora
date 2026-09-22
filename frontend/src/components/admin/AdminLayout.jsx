import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Prevent body scrolling while mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-var(--pageora-background)">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-var(--pageora-border) bg-[var--pageora-surface) px-4 lg:hidden">
        <div>
          <h1 className="text-2xl font-semibold text-var(--pageora-green)">
            Pageora
          </h1>

          <p className="text-[11px] text-var(--pageora-muted)">
            Admin Panel
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-3xl text-var(--pageora-text) transition hover:bg-[var(--pageora-background)"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="min-w-0 lg:ml-64">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
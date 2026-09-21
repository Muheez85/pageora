import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--pageora-background)]">
      <AdminSidebar />

      <main className="lg:ml-64">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
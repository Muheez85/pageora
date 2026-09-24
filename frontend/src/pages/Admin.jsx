import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../sections/Admin/AdminDashboard";
import AdminBooks from "../sections/Admin/AdminBooks";
import AdminAddBook from "../sections/Admin/AdminAddBook";
import AdminEditBook from "../sections/Admin/AdminEditBook";
import AdminCategories from "../sections/Admin/AdminCategories";
import AdminAuthors from "../sections/Admin/AdminAuthors";
import AdminOrders from "../sections/Admin/AdminOrder";
import AdminOrderDetails from "../sections/Admin/AdminOrderDetails";
import AdminCustomers from "../sections/Admin/AdminCustomers";
import AdminCustomerDetails from "../sections/Admin/AdminCustomerDetails";
import AdminShipping from "../sections/Admin/AdminShipping";
import AdminSettings from "../sections/Admin/AdminSettings";
const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />}/>

       
        <Route path="books" element={<AdminBooks />} />
        <Route path="books/new" element={<AdminAddBook />}/>
        <Route path="books/edit/:id" element={<AdminEditBook />}/>
        <Route path="categories" element={<AdminCategories />}/>
        <Route path="authors" element={<AdminAuthors />}/>
        <Route path="orders" element={<AdminOrders />}/>
        <Route path="orders/:id" element={<AdminOrderDetails />}/>
        <Route path="customers" element={<AdminCustomers />}/>
        <Route path="customers/:id" element={<AdminCustomerDetails />}/>
        <Route path="shipping" element={<AdminShipping />} />
        <Route path="settings" element={<AdminSettings />} />


         <Route path="*" element={
            <Navigate to="/admin/dashboard" replace/>}/>
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
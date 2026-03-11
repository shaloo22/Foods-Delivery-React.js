import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Success from "./Pages/Success";
import AdminDashboard from "./Pages/AdminDashboard";
import Login from "./Pages/Login";
import MyOrders from "./Pages/MyOrders";
import Error from "./Pages/Error";

import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";
import { Toaster } from "react-hot-toast";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Home is accessible to all, but redirects to login if no user session found (per user request) */}
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/success"
          element={<ProtectedRoute element={<Success />} />}
        />
        {/* Properly protect Admin path */}
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-orders"
          element={user ? <MyOrders /> : <Navigate to="/login" />}
        />
        <Route path="/*" element={<Error />} />
      </Routes>
      <ChatBot />
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};


export default App;

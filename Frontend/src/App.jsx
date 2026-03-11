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
import { useLocation } from "react-router-dom";

// Helper component to conditionally show the chatbot
const ConditionalChatBot = () => {
  const location = useLocation();
  // Hide chatbot on login page
  if (location.pathname === "/login") return null;
  return <ChatBot />;
};

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/success"
          element={<ProtectedRoute element={<Success />} />}
        />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/*" element={<Error />} />
      </Routes>
      <ConditionalChatBot />
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};


export default App;

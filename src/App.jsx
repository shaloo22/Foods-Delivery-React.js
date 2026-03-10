import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/success"

          element={<ProtectedRoute element={<Success />} />}
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/*" element={<Error />} />

      </Routes>
      <ChatBot />
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};


export default App;

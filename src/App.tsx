import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import ServicesPage from "@/pages/ServicesPage";
import Manuals from "@/pages/Manuals";
import ManualsPage from "@/pages/ManualsPage";
import ManualEditorPage from "@/pages/ManualEditorPage";
import ReviewQueue from "@/pages/ReviewQueue";
import Search from "@/pages/Search";
import LoginPage from "@/pages/LoginPage";

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="manuals" element={<ManualsPage />} />
          <Route path="manuals/new" element={<ManualEditorPage />} />
          <Route path="manuals/:id/edit" element={<ManualEditorPage />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="search" element={<Search />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
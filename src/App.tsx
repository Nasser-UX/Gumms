import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import ServicesPage from "@/pages/ServicesPage";
import Manuals from "@/pages/Manuals";
import ReviewQueue from "@/pages/ReviewQueue";
import Search from "@/pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="manuals" element={<Manuals />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "../pages/LandingPages/Home";
import ErrorPage from "../pages/ErrorPage";


export const AppRouter = () => {
  

  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ErrorPage" element={<ErrorPage />} />
      
      
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
      
  );
};

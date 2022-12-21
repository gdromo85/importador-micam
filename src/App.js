import { useEffect, useState } from "react";

import "./App.css";

// react-router components
import { Routes, Route, Navigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import { NavbarLayout } from "./layouts/NavbarLayout";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
//import DayUtils from "@date-io/dayjs";



import SignIn from "./pages/LandingPages/SignIn";

import Home from "./pages/LandingPages/Home";
import ErrorPage from "./pages/ErrorPage";

import { useUsuarioStore } from "./tienda";

function App() {
  //const { pathname } = useLocation();
  const usuario = useUsuarioStore((state) => state.usuario);
  //const login = useUsuarioStore((state) => state.loginUsuario);
  

  //const loadingInicio = useStoreLoading(state => state.loadingInicio)
  //const loadingFin = useStoreLoading(state => state.loadingFin)

  dayjs.locale("es");
  return (
    <>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={dayjs.locale("es")}
      >
        {usuario.logueado ? (
          <>
            <NavbarLayout />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ErrorPage" element={<ErrorPage />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </LocalizationProvider>
    </>
  );
}

export default App;

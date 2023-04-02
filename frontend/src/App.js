import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./themeGreen";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "./scenes/Dashboard";
import Layout from "./scenes/Layout";
import AllUsers from "./scenes/AllUsers"
import Login from "./scenes/Login"
import Register from "./scenes/Register"
import Profile from "./scenes/Profile"
import RecyclingHistory from "./scenes/RecyclingHistory"
import RecyclingLocation from "./scenes/RecyclingLocation";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manageusers" element={<AllUsers />} />
              <Route path="/manageprofile" element={<Profile />} />
              <Route path="/recyclinghistory" element={<RecyclingHistory />} />
              <Route path="/recyclinglocation" element={<RecyclingLocation />} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

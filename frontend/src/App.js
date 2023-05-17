import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "./scenes/Dashboard";
import Layout from "./scenes/Layout";
import AllUsers from "./scenes/AllUsers";
import Login from "./scenes/Login";
import Register from "./scenes/Register";
import Profile from "./scenes/Profile";
import RecyclingHistory from "./scenes/RecyclingHistory";
import RecyclingLocation from "./scenes/RecyclingLocation";
import Education from "./scenes/Education";
import Leaderboard from "./scenes/Leaderboard";
import Feedbacks from "./scenes/Feedbacks";
import Benefit from "./subscenes/Benefit";
import Home from "./scenes/Home";

function App() {
  // 
  
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const userMode = user ? user.darkMode : null;
  const globalMode = useSelector((state) => state.global.mode);
  const mode = userMode || globalMode;
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              {user ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/education" element={<Education />}>
                    <Route path="benefit" element={<Benefit />} />
                  </Route>
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/feedbacks" element={<Feedbacks />} />
                  {user.isAdmin && (
                    <Route path="/manageusers" element={<AllUsers />} />
                  )}
                  <Route path="/userprofile" element={<Profile />} />
                  {/* {user.isAdmin && ( */}
                    <Route
                      path="/recyclinghistory"
                      element={<RecyclingHistory />}
                    />
                  {/* )} */}
                  <Route
                    path="/recyclinglocation"
                    element={<RecyclingLocation />}
                  />
                </>
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </>
              )}
              <Route
                path="*"
                element={
                  <Navigate to={user ? "/dashboard" : "/home"} replace />
                }
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;


import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";

// Protect all website pages
function ProtectedRoute() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

function AppLayout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-light dark:bg-slate-900">
      {!isAuthPage && <Navbar />}

      <div className="flex">
        {!isAuthPage && <Sidebar />}

        <main
          className={`flex-1 ${
            isAuthPage ? "" : "ml-0 md:ml-64"
          }`}
        >
          <Routes>
            {/* Public pages */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* Login required for all website pages */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/tasks"
                element={<Tasks />}
              />

              <Route
                path="/calendar"
                element={<Calendar />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/settings"
                element={
                  <Navigate
                    to="/profile"
                    replace
                  />
                }
              />
            </Route>

            {/* Unknown URLs */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
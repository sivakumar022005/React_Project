
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || ""
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const syncAccount = () => {
      setUserName(localStorage.getItem("userName") || "");
      setIsLoggedIn(
        localStorage.getItem("isLoggedIn") === "true"
      );
    };

    window.addEventListener(
      "task-forge-account-updated",
      syncAccount
    );
    window.addEventListener("storage", syncAccount);

    return () => {
      window.removeEventListener(
        "task-forge-account-updated",
        syncAccount
      );
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/calendar", label: "Calendar" },
    { path: "/profile", label: "Profile" },
  ];

  // Prevent unauthenticated users from opening protected links
  const handleProtectedNavigation = (event, path) => {
    if (!isLoggedIn) {
      event.preventDefault();
      setIsMobileMenuOpen(false);
      navigate("/login");
      return;
    }

    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setUserName("");
    setIsMobileMenuOpen(false);

    window.dispatchEvent(
      new Event("task-forge-account-updated")
    );

    navigate("/login", { replace: true });
  };

  const renderNavLinks = (mobile = false) =>
    navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={(event) =>
          handleProtectedNavigation(event, link.path)
        }
        className={({ isActive }) =>
          `${mobile ? "block " : ""}px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
          }`
        }
      >
        {link.label}
      </NavLink>
    ));

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>

            <span className="text-xl font-bold gradient-text dark:text-white">
              Task Forge
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-1">
              {renderNavLinks()}
            </div>
          )}

          {/* Desktop Sign In / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2"
                  title={userName || "My Profile"}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {initials}
                  </div>

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {userName || "My Profile"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            {isLoggedIn && (
              <div className="flex flex-col space-y-1">
                {renderNavLinks(true)}
              </div>
            )}

            <div className="mt-3 px-4">
              {isLoggedIn ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-semibold">
                      {initials}
                    </span>
                    {userName || "My Profile"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

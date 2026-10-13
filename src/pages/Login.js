import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // =========================================================
  // CHECK ALREADY LOGGED IN
  // =========================================================

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    const userEmail = localStorage.getItem("userEmail");

    if (isLoggedIn && userEmail) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // =========================================================
  // REGEX
  // =========================================================

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const validateEmail = (value) => {
    setEmail(value);
    setLoginError("");

    if (value.trim() === "") {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value.trim())) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  const validatePassword = (value) => {
    setPassword(value);
    setLoginError("");

    if (value === "") {
      setPasswordError("Password is required");
    } else if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
    } else {
      setPasswordError("");
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (e) => {
    e.preventDefault();

    setLoginError("");

    let isValid = true;

    // -------------------------------------------------------
    // EMAIL CHECK
    // -------------------------------------------------------

    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // -------------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------------

    if (password === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return;
    }

    // =======================================================
    // GET ALL REGISTERED USERS
    // =======================================================

    const savedAccounts =
      localStorage.getItem("userAccounts");

    // No users registered
    if (!savedAccounts) {
      setLoginError(
        "No account found. Please create an account first."
      );
      return;
    }

    let accounts;

    try {
      accounts = JSON.parse(savedAccounts);
    } catch (error) {
      setLoginError(
        "Unable to read account information. Please register again."
      );
      return;
    }

    // Make sure userAccounts is an array
    if (!Array.isArray(accounts)) {
      setLoginError(
        "Account data is invalid. Please register again."
      );
      return;
    }

    // No registered users
    if (accounts.length === 0) {
      setLoginError(
        "No account found. Please create an account first."
      );
      return;
    }

    // =======================================================
    // FIND USER
    // =======================================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = accounts.find(
      (account) =>
        String(account.email || "")
          .trim()
          .toLowerCase() === normalizedEmail
    );

    // =======================================================
    // EMAIL NOT FOUND
    // =======================================================

    if (!existingUser) {
      setLoginError(
        "Account not found. Please check your email or create a new account."
      );
      return;
    }

    // =======================================================
    // PASSWORD CHECK
    // =======================================================

    if (password !== existingUser.password) {
      setLoginError(
        "Incorrect password. Please enter the correct password."
      );
      return;
    }

    // =======================================================
    // LOGIN SUCCESS
    // =======================================================

    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem(
      "userEmail",
      existingUser.email
    );

    localStorage.setItem(
      "userName",
      existingUser.fullName || ""
    );

    // Save complete current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(existingUser)
    );

    // =======================================================
    // EVENT
    // =======================================================

    window.dispatchEvent(
      new Event("task-forge-account-updated")
    );

    // =======================================================
    // GO TO DASHBOARD
    // =======================================================

    navigate("/dashboard", {
      replace: true,
    });
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* LOGO / HEADER */}

        <div className="text-center mb-6 text-white">

          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            ⚡
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Task Forge
          </h1>

          <p className="text-blue-100 mt-1">
            Smart Task Management
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* TITLE */}

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-slate-800">
              Welcome Back 👋
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Sign in to continue to your workspace
            </p>

          </div>

          {/* LOGIN ERROR */}

          {loginError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              ⚠ {loginError}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  validateEmail(e.target.value)
                }
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  emailError
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : email
                    ? "border-green-400 focus:ring-2 focus:ring-green-200"
                    : "border-slate-300 focus:ring-2 focus:ring-blue-200"
                }`}
                required
              />

              {emailError && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ {emailError}
                </p>
              )}

              {!emailError && email && (
                <p className="text-green-600 text-xs mt-2">
                  ✓ Valid email address
                </p>
              )}

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    validatePassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-16 rounded-xl border outline-none transition ${
                    passwordError
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : password
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-200"
                  }`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              {passwordError && (
                <p className="text-red-500 text-xs mt-2 leading-5">
                  ⚠ {passwordError}
                </p>
              )}

              {!passwordError && password && (
                <p className="text-green-600 text-xs mt-2">
                  ✓ Strong password
                </p>
              )}

            </div>

            {/* REMEMBER / FORGOT */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                Remember me

              </label>

              <button
                type="button"
                className="text-blue-600 font-medium hover:text-blue-800"
                onClick={() =>
                  setLoginError(
                    "Please contact your administrator to reset your password."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-lg shadow-blue-200"
            >
              Sign In →
            </button>

          </form>

          {/* REGISTER */}

          <div className="text-center mt-7">

            <p className="text-sm text-slate-500">
              Don't have an account?

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="ml-1 text-blue-600 font-semibold hover:text-blue-800"
              >
                Create an Account
              </button>

            </p>

          </div>

        </div>

        {/* FOOTER */}

        <p className="text-center text-blue-100 text-xs mt-6">
          © 2026 Task Forge. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Login;
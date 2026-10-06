import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [registerError, setRegisterError] = useState("");

  /* =========================================================
     REGEX
  ========================================================= */

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /* =========================================================
     NAME VALIDATION
  ========================================================= */

  const validateName = (value) => {
    setFullName(value);
    setRegisterError("");

    if (value.trim() === "") {
      setNameError("Full name is required");
    } else if (!nameRegex.test(value.trim())) {
      setNameError("Enter your first name and last name");
    } else {
      setNameError("");
    }
  };

  /* =========================================================
     EMAIL VALIDATION
  ========================================================= */

  const validateEmail = (value) => {
    setEmail(value);
    setRegisterError("");

    if (value.trim() === "") {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value.trim())) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const validatePassword = (value) => {
    setPassword(value);
    setRegisterError("");

    if (value === "") {
      setPasswordError("Password is required");
    } else if (!passwordRegex.test(value)) {
      setPasswordError(
        "Must contain 8+ characters, uppercase, lowercase, number and special character"
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  /* =========================================================
     CONFIRM PASSWORD
  ========================================================= */

  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    setRegisterError("");

    if (value === "") {
      setConfirmPasswordError(
        "Please confirm your password"
      );
    } else if (value !== password) {
      setConfirmPasswordError(
        "Passwords do not match"
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  /* =========================================================
     GET EXISTING USERS
  ========================================================= */

  const getExistingUsers = () => {
    /*
      First check new multi-user storage.
    */

    try {
      const savedUsers =
        localStorage.getItem("userAccounts");

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);

        if (Array.isArray(parsedUsers)) {
          return parsedUsers;
        }
      }
    } catch (error) {
      console.error(
        "Unable to read user accounts:",
        error
      );
    }

    /*
      OLD VERSION MIGRATION

      Earlier version used:
      userAccount

      Convert old single account into:
      userAccounts[]
    */

    try {
      const oldAccount =
        localStorage.getItem("userAccount");

      if (oldAccount) {
        const parsedAccount = JSON.parse(oldAccount);

        if (
          parsedAccount &&
          typeof parsedAccount === "object" &&
          parsedAccount.email
        ) {
          const migratedUsers = [parsedAccount];

          localStorage.setItem(
            "userAccounts",
            JSON.stringify(migratedUsers)
          );

          localStorage.removeItem("userAccount");

          return migratedUsers;
        }
      }
    } catch (error) {
      console.error(
        "Unable to migrate old account:",
        error
      );
    }

    return [];
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister = (e) => {
    e.preventDefault();

    setRegisterError("");

    let isValid = true;

    /* =======================================================
       NAME
    ======================================================= */

    if (fullName.trim() === "") {
      setNameError("Full name is required");
      isValid = false;
    } else if (!nameRegex.test(fullName.trim())) {
      setNameError(
        "Enter your first name and last name"
      );
      isValid = false;
    } else {
      setNameError("");
    }

    /* =======================================================
       EMAIL
    ======================================================= */

    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    /* =======================================================
       PASSWORD
    ======================================================= */

    if (password === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    /* =======================================================
       CONFIRM PASSWORD
    ======================================================= */

    if (confirmPassword === "") {
      setConfirmPasswordError(
        "Please confirm your password"
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Passwords do not match"
      );
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    /* =======================================================
       TERMS
    ======================================================= */

    if (!termsAccepted) {
      setTermsError(
        "You must accept the Terms & Conditions"
      );
      isValid = false;
    } else {
      setTermsError("");
    }

    if (!isValid) {
      return;
    }

    /* =======================================================
       NORMALIZED EMAIL
    ======================================================= */

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    /* =======================================================
       GET EXISTING USERS
    ======================================================= */

    const existingUsers = getExistingUsers();

    /* =======================================================
       CHECK DUPLICATE EMAIL
    ======================================================= */

    const alreadyExists = existingUsers.some(
      (user) =>
        String(user?.email || "")
          .trim()
          .toLowerCase() === normalizedEmail
    );

    if (alreadyExists) {
      setRegisterError(
        "An account with this email already exists. Please sign in."
      );

      return;
    }

    /* =======================================================
       CREATE NEW USER
    ======================================================= */

    const newUser = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password,
      createdAt: new Date().toISOString(),
    };

    /* =======================================================
       ADD NEW USER
    ======================================================= */

    const updatedUsers = [
      ...existingUsers,
      newUser,
    ];

    try {
      /*
        IMPORTANT:

        Accounts are stored permanently in localStorage.

        Browser close/reopen will NOT delete accounts.
      */

      localStorage.setItem(
        "userAccounts",
        JSON.stringify(updatedUsers)
      );

      /*
        Remove old single-account storage.
      */

      localStorage.removeItem("userAccount");

      /*
        IMPORTANT:

        New user should NOT automatically login.
        Login session is stored separately in sessionStorage.
      */

      sessionStorage.removeItem("isLoggedIn");

      /*
        Clear currently logged-in user information.
      */

      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("currentUser");

      /*
        Notify other components.
      */

      window.dispatchEvent(
        new Event("task-forge-account-updated")
      );

      /*
        Go to Login page.
      */

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });

    } catch (error) {
      console.error(
        "Unable to save account:",
        error
      );

      setRegisterError(
        "Unable to create your account in this browser."
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-lg">

        {/* LOGO */}

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

        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* HEADER */}

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-slate-800">
              Create Your Account 🚀
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Create an account to start managing your tasks
            </p>

          </div>

          {/* REGISTER ERROR */}

          {registerError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              ⚠ {registerError}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  validateName(e.target.value)
                }
                placeholder="Siva Kumar"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  nameError
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : fullName
                    ? "border-green-400 focus:ring-2 focus:ring-green-200"
                    : "border-slate-300 focus:ring-2 focus:ring-blue-200"
                }`}
              />

              {nameError && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ {nameError}
                </p>
              )}

            </div>

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
              />

              {emailError && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ {emailError}
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
                    validatePassword(
                      e.target.value
                    )
                  }
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 pr-16 rounded-xl border outline-none transition ${
                    passwordError
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : password
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600"
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

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    validateConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-16 rounded-xl border outline-none transition ${
                    confirmPasswordError
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : confirmPassword
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600"
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ {confirmPasswordError}
                </p>
              )}

              {!confirmPasswordError &&
                confirmPassword && (
                  <p className="text-green-600 text-xs mt-2">
                    ✓ Passwords match
                  </p>
                )}

            </div>

            {/* TERMS */}

            <div>

              <label className="flex items-start gap-3 text-sm text-slate-600">

                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(
                      e.target.checked
                    );

                    if (e.target.checked) {
                      setTermsError("");
                    }
                  }}
                  className="w-4 h-4 mt-1 accent-blue-600"
                />

                <span>
                  I agree to the{" "}
                  <span className="text-blue-600 font-medium">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 font-medium">
                    Privacy Policy
                  </span>
                </span>

              </label>

              {termsError && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ {termsError}
                </p>
              )}

            </div>

            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-lg shadow-blue-200"
            >
              Create Account →
            </button>

          </form>

          {/* LOGIN */}

          <div className="text-center mt-7">

            <p className="text-sm text-slate-500">
              Already have an account?

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="ml-1 text-blue-600 font-semibold hover:text-blue-800"
              >
                Sign In
              </button>

            </p>

          </div>

        </div>

        <p className="text-center text-blue-100 text-xs mt-6">
          © 2026 Task Forge. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default Register;
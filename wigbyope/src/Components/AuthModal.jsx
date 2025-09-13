import React, { useState, useEffect } from "react";
import "./AuthModal.css";
import Register from "../Pages/RegisterForm";
import Login from "../Pages/LoginForm";
import ForgotPasswordForm from "../Pages/ForgotPasswordForm"; // ✅ new import

export default function AuthModal({ isOpen, onClose, view: initialView, onLoginSuccess }) {
  const [view, setView] = useState(initialView || "register");

  useEffect(() => {
    if (initialView) setView(initialView);
  }, [initialView]);

  if (!isOpen) return null;

  const handleSwitch = (newView) => {
    setView(newView);
  };

  const handleLoginSuccess = () => {
    if (onLoginSuccess) onLoginSuccess();
    onClose();
  };

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target.classList.contains("auth-modal-overlay")) {
          onClose();
        }
      }}
    >
      <div className="auth-modal-content">
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          &times;
        </button>

        <div className="auth-modal-body">
          {view === "register" && (
            <>
              <h2 id="auth-modal-title" className="auth-title">Register Now</h2>
              <Register isModal onLoginSuccess={handleLoginSuccess} />
              <div className="auth-footer">
                <p>
                  Already have an account?{" "}
                  <span className="auth-link" onClick={() => handleSwitch("login")}>
                    Log in
                  </span>
                </p>
              </div>
            </>
          )}

          {view === "login" && (
            <>
              <h2 id="auth-modal-title" className="auth-title">Welcome Back</h2>
              <Login isModal onLoginSuccess={handleLoginSuccess} />
              <div className="auth-footer">
                <p>
                  Don't have an account?{" "}
                  <span className="auth-link" onClick={() => handleSwitch("register")}>
                    Register
                  </span>
                </p>
                <p>
                  <span className="auth-link" onClick={() => handleSwitch("forgot")}>
                    Forgot password?
                  </span>
                </p>
              </div>
            </>
          )}

          {view === "forgot" && (
            <>
              <h2 id="auth-modal-title" className="auth-title">Reset Password</h2>
              <ForgotPasswordForm onSuccess={onClose} />
              <div className="auth-footer">
                <p>
                  Remember your password?{" "}
                  <span className="auth-link" onClick={() => handleSwitch("login")}>
                    Back to login
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

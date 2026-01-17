import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../api";
import "./LoginForm.css"; // Import the custom CSS file

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function Login({ isModal = false, onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <main className="login-container">
      {!isModal && (
        <header className="login-header">
          <h1>Welcome Back </h1>
          {/* <p>Sign in to access your personalized wig collection</p> */}
        </header>
      )}
      <div className="login-card">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            setStatus(null);
            try {
              const res = await authAPI.login(values); // Backend returns { token, user: { id, name, email, country, role }, role }
              const { token, user, role } = res; // Destructure full response (new: includes user with country)

              // Save token and full user (including country for currency sync)
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user)); // New: Store user data (triggers CurrencyContext update)

              console.log("Logged in user:", user); // Debug: Should show country: 'NG'

              // Redirect based on role (using user.role for precision)
              if (user.role === "admin") navigate("/admin");
              else navigate("/");

              if (onLoginSuccess) onLoginSuccess();
            } catch (err) {
              setStatus(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form noValidate className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <Field 
                  type="email" 
                  name="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="johndoe@gmail.com"
                  aria-describedby="email-error"
                />
                <ErrorMessage name="email" component="div" className="form-error" id="email-error" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <Field 
                  type="password" 
                  name="password" 
                  id="password" 
                  className="form-input" 
                  aria-describedby="password-error"
                />
                <ErrorMessage name="password" component="div" className="form-error" id="password-error" />
              </div>

              {status && <div className="form-status">{status}</div>}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="login-button"
              >
                {isSubmitting ? "Logging in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
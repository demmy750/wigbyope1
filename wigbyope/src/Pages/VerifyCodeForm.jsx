// src/Pages/VerifyCodeForm.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../api";
import jwtDecode from "jwt-decode";

const VerifySchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^\d{6}$/, "Must be a 6-digit code")
    .required("Verification code is required"),
});

export default function VerifyCodeForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // We expect the email to be passed via state when redirecting here
  const email = location.state?.email;

  if (!email) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>No email provided</h2>
        <p>Please register again.</p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Email Verification</h1>
      <p>
        Enter the 6-digit code we sent to <b>{email}</b>.
      </p>

      <Formik
        initialValues={{ code: "" }}
        validationSchema={VerifySchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const res = await authAPI.verifyEmail({ email, code: values.code });

            // Save token & auto login
            localStorage.setItem("token", res.token);
            const decoded = jwtDecode(res.token);

            // Redirect based on role
            if (decoded.role === "admin") navigate("/admin");
            else navigate("/");

          } catch (err) {
            setStatus(err.message || "Verification failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form noValidate>
            <label htmlFor="code">Verification Code</label>
            <Field type="text" name="code" id="code" />
            <ErrorMessage name="code" component="div" style={{ color: "red" }} />

            {status && (
              <div style={{ color: "red", marginTop: "1rem" }}>{status}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: "1rem" }}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export default function Register({ isModal = false, onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      {!isModal && <h1>Register</h1>}
      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const { confirmPassword, ...payload } = values;
            const res = await fetch("http://localhost:5000/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.message || "Registration failed");
            }
            const data = await res.json();
            localStorage.setItem("token", data.token);

            if (onLoginSuccess) {
              onLoginSuccess();
            } else {
              navigate("/");
            }
          } catch (err) {
            setStatus(err.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form noValidate>
            <label htmlFor="name">Name</label>
            <Field type="text" name="name" id="name" />
            <ErrorMessage name="name" component="div" style={{ color: "red" }} />

            <label htmlFor="email" style={{ marginTop: "1rem" }}>
              Email
            </label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" component="div" style={{ color: "red" }} />

            <label htmlFor="password" style={{ marginTop: "1rem" }}>
              Password
            </label>
            <Field type="password" name="password" id="password" />
            <ErrorMessage name="password" component="div" style={{ color: "red" }} />

            <label htmlFor="confirmPassword" style={{ marginTop: "1rem" }}>
              Confirm Password
            </label>
            <Field type="password" name="confirmPassword" id="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" style={{ color: "red" }} />

            {status && <div style={{ color: "red", marginTop: "1rem" }}>{status}</div>}

            <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
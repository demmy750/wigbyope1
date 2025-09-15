import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../api";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function Login({ isModal = false, onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      {!isModal && <h1>Login</h1>}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const res = await authAPI.login(values);
            // Save token
            localStorage.setItem("token", res.token);

            // Redirect based on role
            if (res.role === "admin") navigate("/admin");
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
          <Form noValidate>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" component="div" style={{ color: "red" }} />

            <label htmlFor="password" style={{ marginTop: "1rem" }}>Password</label>
            <Field type="password" name="password" id="password" />
            <ErrorMessage name="password" component="div" style={{ color: "red" }} />

            {status && <div style={{ color: "red", marginTop: "1rem" }}>{status}</div>}

            <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}













// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const LoginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string().min(6, "Too short").required("Required"),
// });

// export default function Login({ isModal = false, onLoginSuccess }) {
//   const navigate = useNavigate();

//   return (
//     <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
//       {!isModal && <h1>Login</h1>}
//       <Formik
//         initialValues={{ email: "", password: "" }}
//         validationSchema={LoginSchema}
//         onSubmit={async (values, { setSubmitting, setStatus }) => {
//           setStatus(null);
//           try {
//             const res = await fetch("http://localhost:5000/api/auth/login", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(values),
//             });
//             if (!res.ok) {
//               const errData = await res.json();
//               throw new Error(errData.message || "Login failed");
//             }
//             const data = await res.json();
//             localStorage.setItem("token", data.token);

//             if (onLoginSuccess) {
//               onLoginSuccess();
//             } else {
//               navigate("/");
//             }
//           } catch (err) {
//             setStatus(err.message);
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, status }) => (
//           <Form noValidate>
//             <label htmlFor="email">Email</label>
//             <Field type="email" name="email" id="email" />
//             <ErrorMessage name="email" component="div" style={{ color: "red" }} />

//             <label htmlFor="password" style={{ marginTop: "1rem" }}>
//               Password
//             </label>
//             <Field type="password" name="password" id="password" />
//             <ErrorMessage name="password" component="div" style={{ color: "red" }} />

//             {status && <div style={{ color: "red", marginTop: "1rem" }}>{status}</div>}

//             <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
//               {isSubmitting ? "Logging in..." : "Login"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </main>
//   );
// }
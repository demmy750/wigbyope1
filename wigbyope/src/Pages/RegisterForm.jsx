import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../api";

// Predefined countries (expand as needed; includes currency mapping for future use)
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  // Add more: { code: 'FR', name: 'France' }, etc.
];

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  country: Yup.string().required("Country is required"), // New: Validate country
});

export default function Register({ onRegistrationSuccess }) {
  return (
    <Formik
      initialValues={{ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
        country: "US", // Default country
      }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        setStatus(null);
        try {
          const { confirmPassword, ...payload } = values; // Exclude confirmPassword
          // payload now includes country
          await authAPI.register(payload);
          if (onRegistrationSuccess) onRegistrationSuccess(values.email);
        } catch (err) {
          setStatus(err.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form noValidate className="space-y-3">
          <label>Name</label>
          <Field name="name" className="w-full border p-2 rounded" placeholder="John" />
          <ErrorMessage name="name" component="div" className="text-red-500" />

          <label>Email</label>
          <Field name="email" type="email" className="w-full border p-2 rounded" placeholder="johndoe@gmail.com" />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <label>Password</label>
          <Field name="password" type="password" className="w-full border p-2 rounded" />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <label>Confirm Password</label>
          <Field name="confirmPassword" type="password" className="w-full border p-2 rounded" />
          <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />

          {/* New: Country Dropdown */}
          <label>Country (for currency and shipping)</label>
          <Field as="select" name="country" className="w-full border p-2 rounded">
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Field>
          <ErrorMessage name="country" component="div" className="text-red-500" />

          {status && <div className="text-red-500 mt-2">{status}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { authAPI } from "../api";

// const RegisterSchema = Yup.object().shape({
//   name: Yup.string().min(2, "Too short").required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string().min(6, "Too short").required("Required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Required"),
// });

// export default function Register({ onRegistrationSuccess }) {
//   return (
//     <Formik
//       initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
//       validationSchema={RegisterSchema}
//       onSubmit={async (values, { setSubmitting, setStatus }) => {
//         setStatus(null);
//         try {
//           const { confirmPassword, ...payload } = values;
//           await authAPI.register(payload);
//           if (onRegistrationSuccess) onRegistrationSuccess(payload.email);
//         } catch (err) {
//           setStatus(err.message);
//         } finally {
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({ isSubmitting, status }) => (
//         <Form noValidate className="space-y-3">
//           <label>Name</label>
//           <Field name="name" className="w-full border p-2 rounded"  placeholder='john'/>
//           <ErrorMessage name="name" component="div" className="text-red-500" />

//           <label>Email</label>
//           <Field name="email" type="email" className="w-full border p-2 rounded" placeholder='johndoe@gmail.com' />
//           <ErrorMessage name="email" component="div" className="text-red-500" />

//           <label>Password</label>
//           <Field name="password" type="password" className="w-full border p-2 rounded"  />
//           <ErrorMessage name="password" component="div" className="text-red-500" />

//           <label>Confirm Password</label>
//           <Field name="confirmPassword" type="password" className="w-full border p-2 rounded" />
//           <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />

//           {status && <div className="text-red-500 mt-2">{status}</div>}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//           >
//             {isSubmitting ? "Registering..." : "Register"}
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }




// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const RegisterSchema = Yup.object().shape({
//   name: Yup.string().min(2, "Too short").required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string().min(6, "Too short").required("Required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Required"),
// });

// export default function Register({ isModal = false, onLoginSuccess }) {
//   const navigate = useNavigate();

//   return (
//     <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
//       {!isModal && <h1>Register</h1>}
//       <Formik
//         initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
//         validationSchema={RegisterSchema}
//         onSubmit={async (values, { setSubmitting, setStatus }) => {
//           setStatus(null);
//           try {
//             const { confirmPassword, ...payload } = values;
//             const res = await fetch("http://localhost:5000/api/auth/register", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(payload),
//             });
//             if (!res.ok) {
//               const errData = await res.json();
//               throw new Error(errData.message || "Registration failed");
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
//             <label htmlFor="name">Name</label>
//             <Field type="text" name="name" id="name" />
//             <ErrorMessage name="name" component="div" style={{ color: "red" }} />

//             <label htmlFor="email" style={{ marginTop: "1rem" }}>
//               Email
//             </label>
//             <Field type="email" name="email" id="email" />
//             <ErrorMessage name="email" component="div" style={{ color: "red" }} />

//             <label htmlFor="password" style={{ marginTop: "1rem" }}>
//               Password
//             </label>
//             <Field type="password" name="password" id="password" />
//             <ErrorMessage name="password" component="div" style={{ color: "red" }} />

//             <label htmlFor="confirmPassword" style={{ marginTop: "1rem" }}>
//               Confirm Password
//             </label>
//             <Field type="password" name="confirmPassword" id="confirmPassword" />
//             <ErrorMessage name="confirmPassword" component="div" style={{ color: "red" }} />

//             {status && <div style={{ color: "red", marginTop: "1rem" }}>{status}</div>}

//             <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
//               {isSubmitting ? "Registering..." : "Register"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </main>
//   );
// }  





import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { FaUser, FaEye, FaEyeSlash, FaCheckSquare } from "react-icons/fa";
import { ImCheckboxUnchecked } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import registerImg from "../../assets/SportHubLogo.png";
import toast, { Toaster } from "react-hot-toast";
import { fetchLogin } from "../../redux/feature/auth/loginSlice";
import { getAccessToken } from "../../../src/lib/secureLocalStorage";

// const initialValues = {
//   email: "admin@gmail.com",
//   password: "Admin@12345",
// };

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is incorrect").required("Email is required"),
  password: Yup.string()
    .test("is-strong", function (value) {
      const { path, createError } = this;
      const errors = [];
      if (!/^(?=.*[A-Z])/.test(value))
        errors.push("Capital Letter is required");
      if (!/^(?=.*[a-z])/.test(value))
        errors.push("Lowercase Letter is required");
      if (!/^(?=.*\d)/.test(value)) errors.push("Number is required");
      if (!/^(?=.*[!@#$%^&*])/.test(value))
        errors.push("Special Character is required");
      if (value && value.length < 6)
        errors.push("Must be at least 6 characters");

      return (
        errors.length === 0 ||
        createError({
          path,
          message: `The password must contain: ${errors.join(", ")}`,
        })
      );
    })
    .required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (accessToken) {
      navigate("/");
      // window.location.href = "/";
    }
  }, [accessToken]);

  const handleLogin = async (values) => {
    try {
      await dispatch(fetchLogin(values)).then(() => {
        const token = getAccessToken();
        if (token) {
          setAccessToken(token);
        } else {
          // alert("Only Admin and Editor roles are authorized");
          toast.error("Only Admin and Editor roles are allowed");
        }
      });
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <>
      <section className="h-screen flex justify-center items-center flex-col mx-auto px-4 sm:px-6 bg-[#222162]">
        <Toaster position="top-right" reverseOrder={true} />
        <section className="flex justify-center items-center flex-row gap-8 w-full max-w-md sm:max-w-lg lg:max-w-3xl bg-white p-8 rounded-lg">
          <section className="hidden lg:block w-[320px] h-full">
            <img
              src={registerImg}
              alt="image"
              className="w-full h-full object-cover rounded-lg"
            />
          </section>
          <section className="w-[350px] h-auto flex justify-center items-center flex-col mx-auto">
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl text-[#222162] font-bold pb-2">
              SportHub
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleLogin(values);
                resetForm();
              }}
            >
              <Form>
                <section className="w-[280px] lg:w-[320px] h-full flex items-center flex-col">
                  <div className="relative-label mt-5">
                    <div className="relative w-[280px] lg:w-[320px] h-[50px] flex items-center">
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        for="floating_outlined"
                        class="absolute text-sm text-gray-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Email
                      </label>
                      <FaUser className="absolute right-3 text-[#222162]" />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="text-red-700 text-xs"
                    />
                  </div>

                  <div className="relative-label mt-4 flex flex-col justify-center w-full">
                    <div className="relative w-[280px] lg:w-[320px] h-[50px] flex items-center">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="password"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Password
                      </label>
                      {showPassword ? (
                        <FaEye
                          className="absolute right-3 text-[#222162] cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <FaEyeSlash
                          className="absolute right-3 text-[#222162] cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="text-red-700 text-sm"
                    />
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <button
                      type="submit"
                      className="w-[280px] lg:w-[320px] h-[50px] text-white bg-[#222162] font-semibold text-lg rounded-lg px-5 py-2.5 mt-5 focus:outline-none hover:bg-[#27268a]"
                    >
                      Login
                    </button>
                  </div>
                </section>
              </Form>
            </Formik>
          </section>
        </section>
      </section>
    </>
  );
}

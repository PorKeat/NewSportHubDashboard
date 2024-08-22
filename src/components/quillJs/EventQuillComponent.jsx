import React, { useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Editor from "./Editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import axios from "axios";
import slugify from "slugify";

const EventQuillComponent = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/^http:/, "https:");
  const endPoint = import.meta.env.VITE_EVENT_URL;
  const url = `${baseUrl}${endPoint}`;
  const imageUrl = import.meta.env.VITE_BASE_IMAGE_URL;
  const imageUploadUrl = import.meta.env.VITE_BASE_IMAGE_UPLOAD_URL;
  const [previewUrl, setPreviewUrl] = useState("");

  const initialValues = {
    sport_category: "",
    title: "",
    thumbnail: "",
    location: "",
    date: "",
    contactInfo: "",
    about: "",
    ticketPrice: "",
    ticketReference: null,
    venueMap: null,
    event_type: "",
    slug: "",
  };

  const validationSchema = Yup.object({
    sport_category: Yup.string().required("Required"),
    slug: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    thumbnail: Yup.string().required("Required"),
    // location: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    // contactInfo: Yup.string().required("Required"),
    // about: Yup.string().required("Required"),
    ticketPrice: Yup.number().required("Required"),
    // ticketReference: Yup.string().required("Required"),
    // venueMap: Yup.string().url("Invalid URL").required("Required"),
    event_type: Yup.string().required("Required"),
  });

  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axios.post(imageUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`, // Ensure token is correctly set
        },
      });

      if (response.data.data.file) {
        setFieldValue("thumbnail", response.data.data.file);
        const url = `${imageUrl}${response.data.data.file}`;
        setPreviewUrl(url);
      } else {
        console.error("URL not found in response:", response.data.data.file);
      }

      setUploading(false);
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file:", error);
    }
  };

  const handleSave = async (values, { resetForm }) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) {
      console.error("Editor instance not available.");
      return;
    }

    const descriptionContent = editor.root.innerHTML;
    if (!descriptionContent) {
      console.error("Description content is empty.");
      return;
    }

    const payload = {
      ...values,
      description: descriptionContent,
      date: new Date(values.date).toISOString(),
      ticket_price: parseFloat(values.ticketPrice),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      console.log("Content saved successfully");

      setShowSuccessModal(true);
      resetForm();
      editor.setText("");
      document.getElementById("thumbnail").value = "";
      setPreviewUrl("");
    } catch (error) {
      console.error("Failed to save content", error);
      setShowFailModal(true);
    }
  };

  return (
    <div className="mt-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue, handleChange }) => (
          <Form>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mt-3"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  onChange={(e) => {
                    handleChange(e);
                    const newSlug = slugify(e.target.value, {
                      replacement: "-",
                      lower: true,
                      strict: true,
                      trim: true,
                    });
                    setFieldValue("slug", newSlug);
                  }}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="slug"
                  className="block text-gray-700 font-medium mt-3"
                >
                  Slug
                </label>
                <Field
                  id="slug"
                  name="slug"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="slug"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="sport_category"
                  className="block text-gray-700 font-medium mt-2"
                >
                  Sport Category ID
                </label>
                <Field
                  as="select"
                  id="sport_category"
                  name="sport_category"
                  className="border border-gray-300 mt-1 p-2 rounded-md w-full"
                >
                  <option value="">Select a category</option>
                  <option value="b4686c69-a4fb-4284-9a0c-8c8e271836f3">
                    Football
                  </option>
                  <option value="f4c3597b-2155-4c63-9a7a-5dea3434ccaa">
                    Basketball
                  </option>
                  <option value="2fe56924-fe8a-4ccd-8792-432fe3885692">
                    Volleyball
                  </option>
                  <option value="6da6376b-932a-4f5c-a7aa-c70dacd7b705">
                    Badminton
                  </option>
                </Field>
                <ErrorMessage
                  name="sport_category"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="location"
                  className="block text-gray-700 font-medium "
                >
                  Location
                </label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="date"
                  className="block text-gray-700 font-medium "
                >
                  Date
                </label>
                <Field
                  id="date"
                  name="date"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="contactInfo"
                  className="block text-gray-700 font-medium "
                >
                  Contact Info
                </label>
                <Field
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="contactInfo"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="about"
                  className="block text-gray-700 font-medium "
                >
                  About
                </label>
                <Field
                  id="about"
                  name="about"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="about"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="ticketPrice"
                  className="block text-gray-700 font-medium "
                >
                  Ticket Price
                </label>
                <Field
                  id="ticketPrice"
                  name="ticketPrice"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="ticketPrice"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* <div className="form-group">
              <label
                htmlFor="ticketReference"
                className="block text-gray-700 font-medium "
              >
                Ticket Reference
              </label>
              <Field
                id="ticketReference"
                name="ticketReference"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="ticketReference"
                component="div"
                className="text-red-500 text-sm"
              />
            </div> */}
              {/* <div className="form-group">
              <label
                htmlFor="venueMap"
                className="block text-gray-700 font-medium "
              >
                Venue Map URL
              </label>
              <Field
                id="venueMap"
                name="venueMap"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="venueMap"
                component="div"
                className="text-red-500 text-sm"
              />
            </div> */}
              <div className="form-group">
                <label
                  htmlFor="event_type"
                  className="block text-gray-700 font-medium "
                >
                  Event Type
                </label>
                <Field
                  id="event_type"
                  name="event_type"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="event_type"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </section>
            <label htmlFor="description" className="block text-md mb-2 mt-4">
              Description
            </label>
            <Editor ref={quillRef} readOnly={readOnly} />
            <div className="form-group w-full mt-2">
              <label
                htmlFor="thumbnail"
                className="block text-gray-700 font-medium "
              >
                Thumbnail URL
              </label>
              {/* <Field
                id="thumbnail"
                name="thumbnail"
                onChange={(event) => handleFileChange(event, setFieldValue)}
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              /> */}
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                onChange={(event) => handleFileChange(event, setFieldValue)}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              {previewUrl && (
                <div className="mt-2 flex items-center justify-center border border-gray-300 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <img
                    src={previewUrl}
                    alt="image preview"
                    className="h-[230px] object-cover rounded-lg"
                  />
                </div>
              )}
              {uploading && <p>Uploading...</p>}
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="bg-blue-500 mt-2 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 max-w-lg rounded-md shadow-lg relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Success</span>
            </div>
            <p className="text-lg font-semibold mb-8 text-gray-900">
              Successfully created Events!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 max-w-lg rounded-md shadow-lg relative">
            <button
              onClick={() => setShowFailModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 7.586l4.293-4.293a1 1 0 111.414 1.414L11.414 9l4.293 4.293a1 1 0 01-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 9 4.293 4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>

              <span className="sr-only">Failed</span>
            </div>
            <p className="text-lg font-semibold mb-8 text-gray-900">
              Fail to create Sport Club!
            </p>
            <button
              onClick={() => setShowFailModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventQuillComponent;

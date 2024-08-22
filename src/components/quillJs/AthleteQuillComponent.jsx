import React, { useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Editor from "./Editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import axios from "axios";
import slugify from "slugify";

// Validation schema using Yup
const validationSchema = Yup.object({
  slug: Yup.string().required("Slug is required"),
  name: Yup.string().required("Name is required"),
  dob: Yup.date().required("Date of Birth is required").nullable(),
  pob: Yup.string().required("Place of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  nationality: Yup.string().required("Nationality is required"),
  height: Yup.string().required("Height is required"),
  howToPlay: Yup.string().required("Instructions on how to play are required"),
  achievements: Yup.string().required("Achievements are required"),
  image: Yup.string().required("Image is required"),
  isDraft: Yup.boolean(),
});

const AthleteQuillComponent = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/^http:/, "https:");
  const endPoint = import.meta.env.VITE_ALLATHLETE_URL;
  const url = `${baseUrl}${endPoint}`;
  const imageUploadUrl = import.meta.env.VITE_BASE_IMAGE_UPLOAD_URL;
  const imageUrl = import.meta.env.VITE_BASE_IMAGE_URL;
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axios.post(imageUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data.file) {
        setFieldValue("image", response.data.data.file);
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

    const bodyContent = editor.root.innerHTML;
    if (!bodyContent) {
      console.error("Body content is empty.");
      return;
    }

    const payload = {
      slug: values.slug,
      name: values.name,
      dob: values.dob,
      pob: values.pob,
      gender: values.gender,
      nationality: values.nationality,
      height: values.height,
      how_to_play: values.howToPlay,
      biography: bodyContent,
      achievements: values.achievements,
      image: values.image,
      is_draft: values.isDraft,
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
      document.getElementById("image").value = "";
      setPreviewUrl("");
    } catch (error) {
      console.error("Failed to save content", error);
      setShowFailModal(true);
    }
  };

  return (
    <div className="mx-auto mt-8">
      <Formik
        initialValues={{
          slug: "",
          name: "",
          dob: "",
          pob: "",
          gender: "",
          nationality: "",
          height: "",
          howToPlay: "",
          achievements: "",
          image: "",
          isDraft: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue, handleChange }) => (
          <Form className="form mt-6 space-y-2">
            <div className="grid grid-cols-3 gap-5">
              <div className="form-group">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
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
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="slug"
                  className="block text-gray-700 font-medium mb-1"
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
                  htmlFor="dob"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Date of Birth
                </label>
                <Field
                  id="dob"
                  name="dob"
                  min="1900-01-01"
                  max="2000-12-31"
                  type="date"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="dob"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="form-group">
                <label
                  htmlFor="pob"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Place of Birth
                </label>
                <Field
                  id="pob"
                  name="pob"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="pob"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="gender"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Gender
                </label>
                <Field
                  id="gender"
                  name="gender"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="nationality"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Nationality
                </label>
                <Field
                  id="nationality"
                  name="nationality"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="nationality"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="form-group">
                <label
                  htmlFor="height"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Height
                </label>
                <Field
                  id="height"
                  name="height"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="height"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="howToPlay"
                  className="block text-gray-700 font-medium mb-1"
                >
                  How to Play
                </label>
                <Field
                  id="howToPlay"
                  name="howToPlay"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="howToPlay"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="achievements"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Achievements
                </label>
                <Field
                  id="achievements"
                  name="achievements"
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <ErrorMessage
                  name="achievements"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="mx-auto mt-8 m-0">
              <label htmlFor="body" className="block text-md mb-2">
                Biography
              </label>
              <Editor ref={quillRef} readOnly={readOnly} />
            </div>

            <div className="grid grid-cols-2 gap-5 items-center">
              <div className="form-group">
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />

                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="isDraft"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Is Draft
                </label>
                <Field
                  id="isDraft"
                  name="isDraft"
                  type="checkbox"
                  className="border border-gray-300 p-2 rounded-md"
                />
                <ErrorMessage
                  name="isDraft"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
            <div>
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
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
              type="submit"
            >
              Add
            </button>
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
              Successfully created athlete!
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

export default AthleteQuillComponent;

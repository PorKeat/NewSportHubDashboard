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
  title: Yup.string().required("Title is required"),
  thumbnail: Yup.string().required("Thumbnail URL is required"),
  isDraft: Yup.boolean(),
});

const NewQuillComponent = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/^http:/, "https:");
  const endPoint = import.meta.env.VITE_NEWS_URL;
  const url = `${baseUrl}${endPoint}`;
  const imageUrl = import.meta.env.VITE_BASE_IMAGE_URL;
  const imageUploadUrl = import.meta.env.VITE_BASE_IMAGE_UPLOAD_URL;
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
          Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`,
        },
      });

      // Adjust this line according to the actual response structure
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

  // Function to handle saving content
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
      title: values.title,
      body: bodyContent,
      thumbnail: values.thumbnail,
      content_type: "news",
      is_draft: values.isDraft,
    };

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
    <div className="mx-auto mt-8">
      <Formik
        initialValues={{ slug: "", title: "", thumbnail: "", isDraft: false }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue, handleChange }) => (
          <Form className="form mt-6 space-y-4">
            <div className="form-group">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-1"
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

            <div className="mx-auto mt-8 m-0">
              <label htmlFor="body" className="block text-md mb-2">
                Body
              </label>
              <Editor ref={quillRef} readOnly={readOnly} />
            </div>

            <div className="form-group">
              <label
                htmlFor="thumbnail"
                className="block text-gray-700 font-medium mb-1"
              >
                Thumbnail URL
              </label>
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

            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
              type="submit"
            >
              Add New
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
              Successfully created content!
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

export default NewQuillComponent;

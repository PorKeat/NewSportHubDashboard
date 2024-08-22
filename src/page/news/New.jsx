import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal } from "flowbite-react";
import { IoAddCircle } from "react-icons/io5";
import moment from "moment";
import NewQuillComponent from "../../components/quillJs/NewQuillComponent";
import UpdateNewsComponent from "../../components/quillJs/UpdateNewsComponent";
import { boolean } from "yup";
import { HiOutlineExclamationCircle, HiDotsHorizontal } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { Dropdown } from "flowbite-react";
import { FiDelete } from "react-icons/fi";

export default function New() {
  const [news, setNews] = useState([]);
  const [newDetails, setNewDetails] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewContentModal, setshowNewContentModal] = useState(false);
  const [newToDelete, setNewToDelete] = useState(null);
  const [newsToUpdate, setNewsToUpdate] = useState(null);
  const [showUpdateNewsModal, setShowUpdateNewsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [checkStatus, setCheckStatus] = useState(boolean);
  const [confirmText, setConfirmText] = useState("");
  const [successText, setSuccessText] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const endPoint = import.meta.env.VITE_ALLCONTENT_URL;
  const apiUrl = `${baseUrl}${endPoint}`;
  const token = import.meta.env.VITE_ADMIN_TOKEN;
  const imageUrl = import.meta.env.VITE_BASE_IMAGE_URL;

  const [nextPage, setNextPage] = useState(apiUrl);
  useEffect(() => {
    const fetchNews = async () => {
      let allNews = [];
      let nextUrl = nextPage;

      while (nextUrl) {
        nextUrl = nextUrl.replace(/^http:/, "https:");
        const response = await fetch(nextUrl);
        const newsData = await response.json();
        const filterData = newsData.data.filter(
          (item) => item.content_type === "news"
        );
        allNews = [...allNews, ...filterData];
        nextUrl = filterData.next;
        console.log("New", filterData);
      }
      setNews(allNews);
    };

    fetchNews();
  }, [nextPage, news]);

  // Handle view newContent details
  const handleNewDetails = (newContent) => {
    setNewDetails(newContent);
    setShowNewModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateNewsModal(false);
  };

  const handleNewClub = () => {
    setshowNewContentModal(true);
  };

  // Handle delete newContent
  const handleDeleteNew = (id) => {
    setNewToDelete(id);
    setConfirmText("Are you sure you want to delete this new?");
    setShowDeleteModal(true);
  };
  // Handle update new
  const handleUpdateNews = (newsData) => {
    setNewsToUpdate(newsData);
    setShowUpdateNewsModal(true);
  };

  const confirmUpdateStatus = async () => {
    const payload = {
      is_deleted: checkStatus,
    };

    const updateUrl = `${baseUrl}contents/${newStatus}/`;

    try {
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        console.log("Content saved successfully");
        checkStatus
          ? setSuccessText("Update status successfully.")
          : setSuccessText("Restore Content successfully.");
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`Network response was not ok: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to save content", error);
      // setShowFailModal(true);
    }
  };

  const confirmDeleteNew = async () => {
    const deleteUrl = `${baseUrl}${
      import.meta.env.VITE_DELETE_CONTENT_URL
    }${newToDelete}/`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newNews = news.filter(
          (newContent) => newContent.id !== newToDelete
        );
        setNews(newNews);
        setSuccessText("Remove content successfully.");
        setShowDeleteModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("Failed to delete the news");
        // Handle error case
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error case
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row) =>
        row.title.length > 15 ? row.title.substring(0, 15) + "..." : row.title,
    },
    {
      name: "Created_By",
      selector: (row) => row.created_by.username,
    },
    {
      name: "Created_At",
      selector: (row) => moment(row.created_at).format("YYYY-MM-DD"),
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`font-semibold flex items-center justify-center w-20 h-8 rounded-full text-slate-700 border-2
            ${
              row.is_deleted
                ? "bg-red-200 border-red-400"
                : "bg-green-200 border-green-400"
            }
          `}
        >
          {row.is_deleted ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex space-x-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<HiDotsHorizontal size={20} color="orange" />}
          >
            <Dropdown.Item
              onClick={() => handleNewDetails(row)}
              className="flex gap-3 cursor-pointer"
            >
              <>
                <FaEye color="blue" />
                <label className="cursor-pointer">View</label>
              </>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDeleteNew(row.id)}
              className="flex gap-3 cursor-pointer"
            >
              <>
                <MdDelete color="red" />
                <label className="cursor-pointer">Delete</label>
              </>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleUpdateNews(row)}
              className="flex gap-3 cursor-pointer"
            >
              <>
                <MdEdit color="green" />
                <label className="cursor-pointer">Edit</label>
              </>
            </Dropdown.Item>
          </Dropdown>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <section className="mt-14 xl:ml-64 p-0 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">All News</h1>
          <button
            onClick={handleNewClub}
            className="flex justify-center items-center ml-3 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded"
          >
            <IoAddCircle className="mr-2" /> Add
          </button>
        </div>
        <DataTable
          className="no-scrollbar"
          columns={columns}
          data={news}
          fixedHeader
          pagination
          pointerOnHover
          highlightOnHover
          customStyles={customStyles}
        />
      </div>

      {/* New details modal */}
      <Modal show={showNewModal} onClose={() => setShowNewModal(false)}>
        <Modal.Header>New Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex justify-center">
              <img
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={
                  newDetails?.thumbnail
                    ? `${imageUrl}${newDetails.thumbnail}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"
                }
                alt="New Image"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              {newDetails?.title || "Unknown"}
            </h2>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 px-4 text-center">
              {moment(newDetails?.date).format("YYYY-MM-DD") || "No date."}
            </p>
            <p
              className="text-base leading-relaxed text-gray-600 dark:text-gray-400 px-4"
              dangerouslySetInnerHTML={{
                __html: newDetails?.body || "No description available.",
              }}
            ></p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add news */}
      <Modal
        show={showNewContentModal}
        onClose={() => setshowNewContentModal(false)}
      >
        <Modal.Header>Add New</Modal.Header>
        <Modal.Body className="pt-0">
          <div className="space-y-6">
            <NewQuillComponent />
          </div>
        </Modal.Body>
      </Modal>

      {/* update news modal */}
      <Modal
        size="2xl"
        show={showUpdateNewsModal}
        onClose={() => setShowUpdateNewsModal(false)}
      >
        <Modal.Header>Update New</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 mb-2">
            <UpdateNewsComponent
              newsData={newsToUpdate}
              OnSuccess={handleUpdateSuccess}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Status confirmation modal */}
      <Modal
        show={showConfirmModal}
        size="md"
        onClose={() => setShowConfirmModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {confirmText}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmUpdateStatus}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowConfirmModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => setShowDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {confirmText}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteNew}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success modal */}
      {showSuccessModal && (
        <div
          id="successModal"
          className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowSuccessModal(false)}
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
              <p className="mb-4 text-lg font-semibold text-gray-900">
                {successText}
              </p>
              <button
                type="button"
                className="py-2 px-3 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
                onClick={() => setShowSuccessModal(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiDotsHorizontal } from "react-icons/hi";
import { FaEye, FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { Dropdown } from "flowbite-react";
import moment from "moment";
import { boolean } from "yup";

export default function User() {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [checkStatus, setCheckStatus] = useState(boolean);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const usersEndPoint = import.meta.env.VITE_ALLUSER_URL;
  const apiUrl = `${baseUrl}${usersEndPoint}`;
  const token = import.meta.env.VITE_ADMIN_TOKEN;

  useEffect(() => {
    const fetchUsers = async () => {
      let allUsers = [];
      let nextUrl = apiUrl;

      while (nextUrl) {
        nextUrl = nextUrl.replace(/^http:/, "https:");
        try {
          const response = await fetch(nextUrl, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            allUsers = [...allUsers, ...data.results];
            nextUrl = data.next;
          } else {
            console.error("Failed to fetch users");
            break;
          }
        } catch (error) {
          console.error("Error:", error);
          break;
        }
      }
      setUsers(allUsers);
    };

    fetchUsers();
  }, [apiUrl, users]);

  // Handle view user details
  const handleUserDetails = (user) => {
    setUserDetails(user);
    setShowUserModal(true);
  };

  const handleUpgradeUser = (id) => {
    setUserToUpdate(id);
    console.log("ID", id);
    setConfirmText("Upgrade User to Editor.");
    setShowUpgradeModal(true);
    setCheckStatus(true);
  };

  const handleDowngradeUser = (id) => {
    setUserToUpdate(id);
    console.log("ID", id);
    setConfirmText("Upgrade Editor to User.");
    setShowUpgradeModal(true);
    setCheckStatus(false);
  };

  const handleUpdateUser = (id) => {
    setUserToUpdate(id);
    console.log("ID", id);
    setConfirmText("Are you sure you want to make this user active?");
    setShowConfirmModal(true);
    setCheckStatus(true);
  };

  // Handle delete user
  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setConfirmText("Are you sure you want to remove this user?");
    setShowConfirmModal(true);
    setCheckStatus(false);
  };

  const confirmUpgradeUser = async () => {
    const payload = {
      user_id: userToUpdate,
      role_id: checkStatus
        ? "1513859f-71ed-460e-b18d-39862133d81f"
        : "cfacf5e3-e969-41c6-9996-df90a173137a",
    };
    console.log("Role", payload.role_id);
    const updateUrl = `${baseUrl}update-user-role/`;

    try {
      const response = await fetch(updateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSuccessText("User activated successfully.");
        console.log("Content saved successfully");
        setShowUpgradeModal(false);
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

  const confirmUpdateUser = async () => {
    const payload = {
      is_deleted: false,
    };

    console.log(userToUpdate);
    const updateUrl = `${baseUrl}users/${userToUpdate}/`;

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
        setSuccessText("User activated successfully.");
        console.log("Content saved successfully");
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

  const confirmDeleteUser = async () => {
    const deleteUrl = `${apiUrl}${userToDelete}/`; // Construct the delete endpoint URL

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`, // Include the access token in the request headers
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        setSuccessText("Successfully removed user.");
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("Failed to delete the user");
        // Handle error case
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error case
    }
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.username,
    },
    {
      name: "Role",
      selector: (row) => row.role.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`font-semibold flex items-center justify-center w-20 h-8 rounded-full text-slate-700 border-2
            ${
              row.is_deleted
                ? "bg-red-200 border-red-400"
                : row.role.name === "admin"
                ? "bg-green-200 border-green-400"
                : !row.is_verified
                ? "bg-yellow-200 border-yellow-400"
                : "bg-green-200 border-green-400"
            }
          `}
        >
          {row.is_deleted
            ? "Inactive"
            : row.role.name === "admin"
            ? "Active"
            : !row.is_verified
            ? "Pending"
            : "Active"}
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
              onClick={() => handleUserDetails(row)}
              className="flex gap-3 cursor-pointer"
            >
              <>
                <FaEye color="blue" />
                <label className="cursor-pointer">View</label>
              </>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={
                row.is_deleted
                  ? () => handleUpdateUser(row.id)
                  : () => handleDeleteUser(row.id)
              }
              className="flex gap-3 cursor-pointer"
            >
              {row.is_deleted ? (
                <>
                  <GrUpdate color="green" />
                  <label className="cursor-pointer">Restore</label>
                </>
              ) : (
                <>
                  <MdDelete color="red" />
                  <label className="cursor-pointer">Delete</label>
                </>
              )}
            </Dropdown.Item>
            {row.role.name === "user" &&
            row.is_deleted === false &&
            row.is_verified === true ? (
              <Dropdown.Item
                className="flex gap-3 cursor-pointer"
                onClick={() => handleUpgradeUser(row.id)}
              >
                <>
                  <FaAngleDoubleUp color="green" />
                  <label className="cursor-pointer">Upgrade</label>
                </>
              </Dropdown.Item>
            ) : row.role.name === "editor" &&
              row.is_deleted === false &&
              row.is_verified === true ? (
              <Dropdown.Item
                className="flex gap-3 cursor-pointer"
                onClick={() => handleDowngradeUser(row.id)}
              >
                <>
                  <FaAngleDoubleDown color="orange" />
                  <label className="cursor-pointer">Downgrade</label>
                </>
              </Dropdown.Item>
            ) : null}
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
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>
        <DataTable
          className="no-scrollbar"
          columns={columns}
          data={users}
          fixedHeader
          pagination
          pointerOnHover
          highlightOnHover
          customStyles={customStyles}
        />
      </div>

      {/* User details modal */}
      <Modal show={showUserModal} onClose={() => setShowUserModal(false)}>
        <Modal.Header>User Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 p-6 bg-white dark:bg-gray-800 dark:text-gray-200">
            <div className="flex justify-center">
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 dark:border-gray-600"
                src={
                  userDetails?.profile_image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"
                }
                alt="User Avatar"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
              {userDetails?.username || "Unknown"}
            </h2>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              {userDetails?.role?.name || "No role available."}
            </p>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              {userDetails?.email || "No email available."}
            </p>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              CreateDate:
              {" " + moment(userDetails?.created_at).format("YYYY-MM-DD") ||
                "No date available."}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Upgrade modal */}
      <Modal
        show={showUpgradeModal}
        size="md"
        onClose={() => setShowUpgradeModal(false)}
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
              <Button color="failure" onClick={confirmUpgradeUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowUpgradeModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/*Confirmation modal */}
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
              <Button
                color="failure"
                onClick={checkStatus ? confirmUpdateUser : confirmDeleteUser}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowConfirmModal(false)}>
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

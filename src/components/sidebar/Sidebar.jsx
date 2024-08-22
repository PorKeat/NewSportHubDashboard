import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../../assets/SportHubLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaChartBar,
  FaDatabase,
  FaSignInAlt,
  FaUser,
  FaUserEdit,
  FaChartPie,
  FaRegCalendarCheck,
  FaNewspaper,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "flowbite";
import SportHubLogo from "../../assets/SportHubLogo.png";
import { getRole, getUser } from "../../lib/secureLocalStorage";
import { layouts } from "chart.js";
import { logout } from "../../redux/feature/auth/loginSlice";
import { removeAccessToken } from "../../lib/secureLocalStorage";

export function Sidebar() {
  const location = useLocation();
  const pathName = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getRole();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const userData = getUser();

  console.log(userData);

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // removeAccessToken();
    navigate("/login");
  };

  return (
    <section className="relative max-w-screen-2xl mx-auto">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zm0-5.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75z"
                  ></path>
                </svg>
              </button>
              <Link to="/dashboard" className="flex ms-2 md:me-24">
                <img src={SportHubLogo} className="h-8" alt="SportHub Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  <span className="text-red-700 font-bold">Sport </span> Hub
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative ms-3">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      userData.profile ||
                      "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    alt="user photo"
                  />
                </button>
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                    style={{ top: "100%", right: "0", marginRight: "8px" }}
                  >
                    <div className="px-4 py-3" role="admin">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {userData.username}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                        {userData.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
                end
              >
                {/* <RiDashboard3Fill /> */}
                <FaChartPie />
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/static"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaChartBar />
                <span className="flex-1 ms-3 whitespace-nowrap">Statistic</span>
              </NavLink>
            </li>

            <li>
              {/* Check Role */}
              {role !== "editor" && (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`
                    }
                  >
                    <FaUser />
                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                  </NavLink>
                </li>
              )}
            </li>
            <li>
              <NavLink
                to="/sport-club"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaDatabase />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Sport Club
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaRegCalendarCheck />
                <span className="flex-1 ms-3 whitespace-nowrap">Events</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaNewspaper />
                <span className="flex-1 ms-3 whitespace-nowrap">News</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaUniversity />
                <span className="flex-1 ms-3 whitespace-nowrap">Histories</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/athlete"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`
                }
              >
                <FaUsers />
                <span className="flex-1 ms-3 whitespace-nowrap">Athletes</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

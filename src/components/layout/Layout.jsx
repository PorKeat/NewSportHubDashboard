import React from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <Sidebar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

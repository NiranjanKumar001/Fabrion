"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import WorkspaceHistory from "@/components/custom/WorkspaceHistory";
import { UserDetailContext } from "@/context/UserDetailContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleLogout = () => {
    // ✅ Clear user data from local storage
    localStorage.removeItem("user");

    // ✅ Reset user state
    setUserDetail(null);

    // ✅ Redirect to login page
    router.push("/");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 transition-all duration-300 ease-in-out z-10 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>

          {/* Scrollable Workspace History */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar">
            <WorkspaceHistory />
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-2 mt-4">
            <li className="p-2 hover:bg-gray-800 rounded cursor-pointer">
              Dashboard
            </li>
            <li className="p-2 hover:bg-gray-800 rounded cursor-pointer">
              Projects
            </li>
            <li className="p-2 hover:bg-gray-800 rounded cursor-pointer">
              Settings
            </li>
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;

"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceHistory from "@/components/custom/WorkspaceHistory";
import { UserDetailContext } from "@/context/UserDetailContext";
import ProfileModal from "@/components/custom/ProfileModal"; // Import the new component

const Sidebar = ({ isOpen, onClose }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    //  Clear user data from local storage
    localStorage.removeItem("user");
    
    //  Reset user state
    setUserDetail(null);
    
    //  Redirect to login page
    router.push("/");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
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
          <ul className="space-y-2 mt-2">
            <li 
              className="p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={openProfileModal}
            >
              Profile
            </li>
            <li className="p-2 hover:bg-gray-800 rounded cursor-pointer">
              Settings
            </li>
          </ul>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      
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
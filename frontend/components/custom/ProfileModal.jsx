"use client";
import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "../ui/button";

const ProfileModal = ({ isOpen, onClose }) => {
  const { userDetail } = useContext(UserDetailContext);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [shownewApiKey, setnewShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const updateApiKey = useMutation(api.workspace.UpdateApiKey);

  const getUserData = useQuery(
    api.workspace.GetUserWithApiKey,
    userDetail && userDetail._id ? { userId: userDetail._id } : undefined // Pass undefined if userId is missing
  );

  // Update API key state when query data changes
  useEffect(() => {
    if (getUserData && getUserData.apiKey) {
      setApiKey(getUserData.apiKey);
    }
  }, [getUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await updateApiKey({
        userId: userDetail._id,
        apiKey: apiKey,
      });
      setMessage({ text: "API key updated successfully!", type: "success" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        text: "Failed to update API key. Please try again.",
        type: "error",
      });
      console.error("Error updating API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maskApiKey = (key) => {
    if (!key) return "No API key saved";
    return key.length > 4
      ? "•".repeat(Math.min(12, key.length - 4)) + key.slice(-4)
      : "•".repeat(key.length);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-20" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 z-30 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-medium mb-3">Your API Key</h3>
          {getUserData ? (
            <div className="space-y-3">
              <span className="text-sm text-gray-300">Current Key:</span>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="font-mono text-xs bg-gray-600 py-1 px-2 rounded">
                    {showApiKey && getUserData.apiKey ? getUserData.apiKey : maskApiKey(getUserData.apiKey)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    <Button>Delete</Button>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-gray-400">Loading data...</span>
            </div>
          )}
        </div>


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Update Gemini API Key
            </label>
            <div className="relative">
              <input
                type={shownewApiKey ? "text" : "password"}
                // value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Gemini API key"
              />
              <button
                type="button"
                onClick={() => setnewShowApiKey(!shownewApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {shownewApiKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>

            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your API key is securely stored and used for AI processing.
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded flex items-center ${message.type === "success"
                ? "bg-green-900/50 text-green-200 border border-green-700"
                : "bg-red-900/50 text-red-200 border border-red-700"
                }`}
            >
              <span className="mr-2">
                {message.type === "success" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
              </span>
              {message.text}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : "Save API Key"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileModal;
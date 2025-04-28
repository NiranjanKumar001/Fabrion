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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const updateApiKey = useMutation(api.workspace.UpdateApiKey);
  const deleteApiKey = useMutation(api.workspace.DeleteApiKey);

  const getUserData = useQuery(
    api.workspace.GetUserWithApiKey,
    userDetail && userDetail._id ? { userId: userDetail._id } : "skip"
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

  const handleDeleteApiKey = async () => {
    if (confirm("Are you sure you want to delete your API key?")) {
      setDeleteLoading(true);
      setMessage({ text: "", type: "" });

      try {
        await deleteApiKey({
          userId: userDetail._id
        });
        setMessage({ text: "API key deleted successfully!", type: "success" });
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } catch (error) {
        setMessage({
          text: "Failed to delete API key. Please try again.",
          type: "error",
        });
        console.error("Error deleting API key:", error);
      } finally {
        setDeleteLoading(false);
      }
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
            {/* SVG for close */}
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
                    {/* SVG for show/hide */}
                  </button>
                </div>
                {getUserData.apiKey && (
                  <button
                    type="button"
                    onClick={handleDeleteApiKey}
                    disabled={deleteLoading}
                    className="text-red-400 hover:text-red-300 ml-2 p-1"
                    title="Delete API Key"
                  >
                    {/* SVG for delete or loading */}
                  </button>
                )}
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
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Gemini API key"
              />
              <button
                type="button"
                onClick={() => setnewShowApiKey(!shownewApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {/* SVG for show/hide */}
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
                {/* SVG for success/error */}
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
                  {/* SVG spinner */}
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

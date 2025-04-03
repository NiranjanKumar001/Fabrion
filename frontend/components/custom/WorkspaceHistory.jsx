"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

function WorkspaceHistory() {
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail?._id,
      });
      
      const sortedResult = [...(result || [])].sort((a, b) => b._creationTime - a._creationTime);
      
      setWorkspaceList(sortedResult);
    } catch (error) {
      console.error("Error fetching workspace history:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg text-white">Your Chats</h2>
      <div className="mt-2">
        {workspaceList.length > 0 ? (
          workspaceList.map((workspace, index) => (
            <Link href={`/workspace/${workspace?._id}`} key={index}>
              <h2 className="text-sm text-gray-400 font-light hover:text-white cursor-pointer">
                {workspace?.messages?.[0]?.content || "No messages"}
              </h2>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">No workspaces found.</p>
        )}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
"use client"
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const {userDetail,setuserDetails}=useContext(UserDetailContext)

    useEffect(() => {
        id && GetWorkspaceData();
    }, [id])

    //   Used to Get workspace data from the workspace id

    // console.log(messages)
    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
        // console.log(result)
    };
    return (
        <div>
            <div>

                {messages?.map((msg, index) => (
                    <div key={index} style={{ backgroundColor: Colors.CHAT_BACKGROUND }} className="p-3 rounded-lg mb-2">
                        {msg?.role=='user'&&
                        <Image src={userDetail?.picture}  alt='userImage' width={35} height={35} className='rounded-full'/>}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatView;

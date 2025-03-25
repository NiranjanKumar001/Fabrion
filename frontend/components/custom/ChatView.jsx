"use client"
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { useConvex } from "convex/react";
import { ArrowRight, Link } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const {userDetail,setuserDetails}=useContext(UserDetailContext)
    const [userInput ,setUserInput]=useState();

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
                    <div key={index} style={{ backgroundColor: Colors.CHAT_BACKGROUND }} className="p-3 rounded-lg mb-2 flex gap-2 items-start">
                        {msg?.role=='user'&&
                        <Image src={userDetail?.picture}  alt='userImage' width={35} height={35} className='rounded-full'/>}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
            </div>
            {/* Input section */}
            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{
                backgroundColor: Colors.BACKGROUND
            }}>
                <div className='flex gap-2'>
                    <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
                        onChange={(event) => setUserInput(event.target.value)}
                        className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' />
                    {userInput && <ArrowRight
                        onClick={() => onGenerate(userInput)}
                        className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer' />}
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
        </div>
    )
}

export default ChatView;

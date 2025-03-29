"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, BotIcon, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setuserDetails } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useState();

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  //   Used to Get workspace data from the workspace id

  // console.log(messages)
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages);
    // console.log(result)
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);

    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });

    // console.log(result.data.result);

    const aiResp = {
      role: "ai",
      content: result.data.result,
    };

    setMessages((prev) => [...prev, aiResp]);
    await UpdateMessages({
      messages: [...messages, aiResp],
      workspaceId: id,
    });
    setLoading(false);
  };

  const onGenerate = (input) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll no-scrollbar pl-5">
        {messages?.map((msg, index) => (
          <div
            key={index}
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            className="p-3 rounded-lg mb-4 flex gap-2 items-center leading-7"
          >
            {msg?.role == "user" && (
              <Image
                src={userDetail?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full self-start"
              />
            )}
            {msg?.role == "ai" && (
              <Image
                src="/logo.png"
                alt="AiImage"
                width={35}
                height={35}
                className="rounded-full self-start"
              />
            )}
            <div className="flex flex-col">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
          // react markdown (removed the classname feature in the latest update) so we need to wrap in a paretn and give it the style
        ))}
        {loading && (
          <div
            className="p-5 rounded-lg mb-2 flex gap-2 items-center"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>

      <div className="flex col-span-2">
        <div className=" flex gap-2 items-end">
          {userDetail && (
            <Image
              className="rounded-full cursor-pointer "
              onClick={toggleSidebar}
              src={userDetail?.picture}
              alt="user"
              width={30}
              height={30}
            />
          )}
        </div>

        <div
          className="p-5 border rounded-xl max-w-2xl w-full mt-3 "
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none "
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;

"use client";

import { MessagesContext } from "@/context/MessagesContext";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);

  const {messages, setMessages} = useContext(MessagesContext)


  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == 'user') {
        GenerateAiCode();
      }
    }
  }, [messages])

  const GenerateAiCode = async () => {
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT
    });
    console.log(result.data);
    const aiResp = result.data;

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files }
    setFiles(mergedFiles);
  }

  return (
    <div>
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider template="react" theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY
          }
        }}
        files={files}
        options={{
          externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',//taulwind cdn
            'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js',//gsap cdn 
            "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",// three js cdn for the dependencies to woek
            "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/", //three js cdn for the dependencies to work
          ]
          // to work with the tailwind in the code editoe in the webpage so we used cdn 
        }}
      >
        <SandpackLayout>
          {/* active tab is set to the code tab  */}
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview style={{ height: "80vh" }} showNavigator={true} />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
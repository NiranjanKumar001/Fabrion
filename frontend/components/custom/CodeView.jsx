"use client";

import { MessagesContext } from "@/context/MessagesContext";
import { api } from "@/convex/_generated/api";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
// import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const [generationStatus, setGenerationStatus] = useState("");

  const { messages, setMessages } = useContext(MessagesContext);

  const UpdateFiles = useMutation(api.workspace.UpdateFiles);

  const { id } = useParams();

  const convex = useConvex();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData }
    setFiles(mergedFiles);
    setLoading(false);
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == 'user') {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    try {
      setLoading(true);
      setGenerationStatus("Starting code generation...");
      
      // Initialize a temporary container for incrementally built files
      let generatedFiles = {};
      
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      
      const response = await fetch('/api/gen-ai-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: PROMPT }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        // Split by double newlines which should separate JSON objects
        const lines = text.split('\n\n');
        
        for (const line of lines) {
          // Only process lines that start with 'data: '
          if (line.startsWith('data: ')) {
            try {
              const jsonText = line.slice(6).trim();
              // Skip empty data chunks
              if (!jsonText) continue;
              
              const data = JSON.parse(jsonText);
              
              if (data.status) {
                setGenerationStatus(data.status);
              }
              
              // Handle individual file updates
              if (data.fileName && data.fileContent) {
                // Add this file to our accumulated files
                generatedFiles = {
                  ...generatedFiles,
                  [data.fileName]: data.fileContent
                };
                
                // Update the UI with the current set of files
                const mergedFiles = { ...Lookup.DEFAULT_FILE, ...generatedFiles };
                setFiles(mergedFiles);
                
                // Update the status with the current file and progress
                setGenerationStatus(`Generating: ${data.fileName} (${data.progress || 0}%)`);
              }
              
              if (data.complete && data.files) {
                // Ensure we have the complete set
                generatedFiles = data.files;
                const mergedFiles = { ...Lookup.DEFAULT_FILE, ...generatedFiles };
                setFiles(mergedFiles);
                setGenerationStatus(data.message || "Files generated successfully!");
                
                // Save to database
                await UpdateFiles({
                  workspaceId: id,
                  files: generatedFiles
                });
              }
              
              if (data.error) {
                setGenerationStatus("Error: " + data.error);
                // console.error("Server reported error:", data.error);
                // Don't throw here - just log and continue
              }
            } catch (parseError) {
              console.error("Error parsing stream data:", parseError);
              // console.log("Problematic data:", line.slice(6));
              // Continue processing other chunks - don't throw
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setGenerationStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border rounded-lg">
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
          externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
          ]
        }}
      >

        <SandpackLayout>
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
      
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex flex-col items-center justify-center gap-4">
          <Loader2Icon className="animate-spin h-10 w-10 text-white"/>
          <h2 className="text-white">Generating your files...</h2>
          <p className="text-gray-300 text-sm max-w-md text-center">{generationStatus}</p>
        </div>
      )}
    </div>
  );
}

export default CodeView;
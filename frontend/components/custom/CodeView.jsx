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
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id
      });
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Failed to get workspace:", error);
      setGenerationStatus("Error loading workspace files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === 'user') {
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
      let processedText = "";
      
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      
      console.log("Starting code generation request");
      
      const response = await fetch('/api/gen-ai-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: PROMPT }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      console.log("Response received:", response.status);
  
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete");
          break;
        }
        
        const chunk = decoder.decode(value, {stream: true});
        processedText += chunk;
        
        // Process complete JSON objects that end with newlines
        const lines = processedText.split('\n');
        // Keep the last potentially incomplete line
        processedText = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonText = line.slice(6).trim();
              // Skip empty data chunks
              if (!jsonText || jsonText === "[DONE]") continue;
              
              console.log("Processing data chunk:", jsonText.substring(0, 50) + "...");
              
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
                
                // Progressive database update for each file
                try {
                  await UpdateFiles({
                    workspaceId: id,
                    files: { [data.fileName]: data.fileContent }
                  });
                  console.log(`Updated file ${data.fileName} in database`);
                } catch (dbError) {
                  console.error("Database update failed for file:", data.fileName, dbError);
                }
                
                // Update the status with the current file and progress
                setGenerationStatus(`Generating: ${data.fileName} (${data.progress || 0}%)`);
              }
              
              if (data.complete && data.files) {
                // Ensure we have the complete set
                generatedFiles = data.files;
                const mergedFiles = { ...Lookup.DEFAULT_FILE, ...generatedFiles };
                setFiles(mergedFiles);
                setGenerationStatus(data.message || "Files generated successfully!");
                
                // Final database update with all files
                try {
                  await UpdateFiles({
                    workspaceId: id,
                    files: generatedFiles
                  });
                  console.log("All files saved to database");
                } catch (finalDbError) {
                  console.error("Final database update failed:", finalDbError);
                  setGenerationStatus("Error saving all files to database");
                }
              }
              
              if (data.error) {
                console.error("Server reported error:", data.error);
                setGenerationStatus("Error: " + data.error);
              }
            } catch (parseError) {
              console.error("Error parsing stream data:", parseError);
              console.log("Problematic data:", line.substring(0, 100));
            }
          }
        }
      }
      
      // Process any remaining data
      if (processedText.trim()) {
        try {
          if (processedText.startsWith('data: ')) {
            const jsonText = processedText.slice(6).trim();
            if (jsonText && jsonText !== "[DONE]") {
              const data = JSON.parse(jsonText);
              console.log("Processing final data chunk");
              
              if (data.complete && data.files) {
                generatedFiles = data.files;
                const mergedFiles = { ...Lookup.DEFAULT_FILE, ...generatedFiles };
                setFiles(mergedFiles);
                setGenerationStatus("Files generated successfully!");
                
                await UpdateFiles({
                  workspaceId: id,
                  files: generatedFiles
                });
              }
            }
          }
        } catch (finalError) {
          console.error("Error processing final chunk:", finalError);
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

      <SandpackProvider 
        template="react" 
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY
          }
        }}
        files={files}
        options={{
          externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
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
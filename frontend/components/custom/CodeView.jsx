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
import React, { useContext, useEffect, useState, useRef } from "react";

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const [generationStatus, setGenerationStatus] = useState("");

  const { messages, setMessages } = useContext(MessagesContext);

  const UpdateFiles = useMutation(api.workspace.UpdateFiles);

  const { id } = useParams();

  const convex = useConvex();

  const [loading, setLoading] = useState(false);

  // Add refs to track request state
  const abortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(null);
  const isGeneratingRef = useRef(false);
  const lastProcessedMessageRef = useRef(null);

  useEffect(() => {
    id && GetFiles();

    // Clean up any pending request when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
    // Check if there are messages and the latest is from the user
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // Only process if it's a new user message and we're not already generating
      if (lastMessage.role === 'user' &&
        !isGeneratingRef.current &&
        lastProcessedMessageRef.current !== JSON.stringify(lastMessage)) {

        // Mark this message as being processed
        lastProcessedMessageRef.current = JSON.stringify(lastMessage);
        console.log("New user message detected, starting code generation");

        // Generate code with a slight delay to allow UI to update
        setTimeout(() => {
          GenerateAiCode();
        }, 100);
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    // If there's an ongoing request, abort it
    if (abortControllerRef.current) {
      console.log("Aborting previous request:", currentRequestIdRef.current);
      abortControllerRef.current.abort();
    }

    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();

    // Generate a unique ID for this request
    currentRequestIdRef.current = `req_${Date.now()}`;
    const thisRequestId = currentRequestIdRef.current;

    try {
      isGeneratingRef.current = true;
      setLoading(true);
      setGenerationStatus("Starting code generation...");

      // Initialize a temporary container for incrementally built files
      let generatedFiles = {};
      let processedText = "";

      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;

      console.log(`Starting code generation request (ID: ${thisRequestId})`);

      const response = await fetch('/api/gen-ai-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: PROMPT,
          requestId: thisRequestId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      console.log(`Response received for request ${thisRequestId}:`, response.status);

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(`Stream complete for request ${thisRequestId}`);
          break;
        }

        // Check if this request is still the current one
        if (currentRequestIdRef.current !== thisRequestId) {
          console.log(`Request ${thisRequestId} is no longer current, stopping processing`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
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

              const data = JSON.parse(jsonText);

              // Verify this data is for the current request
              if (data.requestId && data.requestId !== thisRequestId) {
                console.log(`Ignoring data for old request ${data.requestId}`);
                continue;
              }

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
              // console.log("Problematic data:", line.substring(0, 100));
            }
          }
        }
      }

      // Process any remaining data
      if (processedText.trim() && currentRequestIdRef.current === thisRequestId) {
        try {
          if (processedText.startsWith('data: ')) {
            const jsonText = processedText.slice(6).trim();
            if (jsonText && jsonText !== "[DONE]") {
              const data = JSON.parse(jsonText);

              // Verify this data is for the current request
              if (!data.requestId || data.requestId === thisRequestId) {
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
          }
        } catch (finalError) {
          console.error("Error processing final chunk:", finalError);
        }
      }

    } catch (error) {
      // Don't show errors for aborted requests
      if (error.name !== 'AbortError') {
        console.error(`Error generating code for request ${thisRequestId}:`, error);
        setGenerationStatus("Error: " + error.message);
      } else {
        console.log(`Request ${thisRequestId} was aborted`);
      }
    } finally {
      // Only reset loading state if this is still the current request
      if (currentRequestIdRef.current === thisRequestId) {
        setLoading(false);
        isGeneratingRef.current = false;
        console.log(`Request ${thisRequestId} completed`);
      }
    }
  };

  // Add a reset function that can be called manually if needed
  const resetGenerationState = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    currentRequestIdRef.current = null;
    isGeneratingRef.current = false;
    setLoading(false);
    setGenerationStatus("");
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border rounded-lg">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[240px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab === "code" && "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab === "preview" && "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
          {loading && (
            <span className="text-xs text-yellow-400">Generating...</span>
          )}
          {!loading && (
            <span className="text-xs text-green-400">Generated</span>
          )}
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
          externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'],
          autorun: true,
          recompileMode: "immediate", 
          recompileDelay: 0,
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
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
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
          <p className="text-gray-300 text-sm max-w-md text-center">{generationStatus}</p>
          <button
            onClick={resetGenerationState}
            className="mt-4 bg-red-600 text-white rounded-md px-3 py-1 text-sm"
          >
            Cancel Generation
          </button>
        </div>
      )}
    </div>
  );
}

export default CodeView;
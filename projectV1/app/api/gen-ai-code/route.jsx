import { GenAiCode } from "@/components/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt, requestId } = await req.json();
  
  // Set up streaming response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const response = new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Prevents Nginx from buffering the response
      'X-Request-ID': requestId || 'unknown' // Echo requestId to help client track responses
    },
  });

  // Process in background
  (async () => {
    try {
      // Send status update
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ 
          status: "Starting generation...", 
          requestId: requestId 
        })}\n\n`)
      );
      
      // Call the AI model
      const result = await GenAiCode.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        const parsedJson = JSON.parse(responseText);
        const files = parsedJson.files || {};
        const fileNames = Object.keys(files);
        
        // Send initial metadata about the response
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            status: "Files received from AI",
            fileCount: fileNames.length,
            requestId: requestId
          })}\n\n`)
        );
        
        // Send each file one by one
        for (let i = 0; i < fileNames.length; i++) {
          const fileName = fileNames[i];
          const fileContent = files[fileName];
          
          // Send a partial update with just this file
          const partialUpdate = {
            fileName: fileName,
            fileContent: fileContent,
            progress: Math.round(((i + 1) / fileNames.length) * 100),
            requestId: requestId
          };
          
          await writer.write(
            encoder.encode(`data: ${JSON.stringify(partialUpdate)}\n\n`)
          );
          
          // Small delay to avoid overwhelming the client
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Send complete data at the end
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            complete: true, 
            files: files,
            message: "All files generated successfully!",
            requestId: requestId
          })}\n\n`)
        );
      } catch (parseError) {
        console.error("Parse error:", parseError);
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            error: "Failed to parse response", 
            details: parseError.message,
            requestId: requestId
          })}\n\n`)
        );
      }
    } catch (e) {
      console.error("API error:", e);
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ 
          error: e.message,
          requestId: requestId
        })}\n\n`)
      );
    } finally {
      await writer.close();
    }
  })();

  return response;
}
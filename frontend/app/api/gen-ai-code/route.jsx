import { GenAiCode } from "@/components/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  
  // Set up streaming response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const response = new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });

  // Process in background
  (async () => {
    try {
      // Send status update
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ status: "Starting generation..." })}\n\n`)
      );
      
      // Call the AI model
      const result = await GenAiCode.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        const parsedJson = JSON.parse(responseText);
        const files = parsedJson.files || {};
        const fileNames = Object.keys(files);
        
        // Send each file one by one
        for (let i = 0; i < fileNames.length; i++) {
          const fileName = fileNames[i];
          const fileContent = files[fileName];
          
          // Send a partial update with just this file
          const partialUpdate = {
            fileName: fileName,
            fileContent: fileContent,
            progress: Math.round(((i + 1) / fileNames.length) * 100)
          };
          
          await writer.write(
            encoder.encode(`data: ${JSON.stringify(partialUpdate)}\n\n`)
          );
          
          // Add a small delay to create a visible effect
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Send complete data at the end
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            complete: true, 
            files: files,
            message: "All files generated successfully!"
          })}\n\n`)
        );
      } catch (parseError) {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: "Failed to parse response" })}\n\n`)
        );
      }
    } catch (e) {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`)
      );
    } finally {
      await writer.close();
    }
  })();

  return response;
}
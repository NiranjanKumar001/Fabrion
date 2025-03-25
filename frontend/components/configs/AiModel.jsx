//copied from the guidde to install the gemini installation guide 
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
};


export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
});

//not required for now but if required we will see.

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// // TODO: Following code needs to be updated for client-side apps.
// const candidates = result.response.candidates;
// for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//   for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//     const part = candidates[candidate_index].content.parts[part_index];
//     if(part.inlineData) {
//       try {
//         const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//         fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//         console.log(`Output written to: ${filename}`);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }
// console.log(result.response.text());

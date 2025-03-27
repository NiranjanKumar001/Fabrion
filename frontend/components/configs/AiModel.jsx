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
    temperature: 0.3,
    topP: 0.85,
    topK: 50,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
    temperature: 0.3,
    topP: 0.85,
    topK: 50,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "application/json",
};


export const chatSession = model.startChat({

    generationConfig,
    history: [
    ],
});


export const GenAiCode = model.startChat({
    generationConfig: CodeGenerationConfig,
    history: [
        {
          role: "user",
          parts: [
            {text: "Generate to do app:Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n   `,\n\n\n\n}\n\n// - The lucide-react library is also available to be imported IF NECCESARY ONLY FOR THE FOLLOWING ICONS: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Clock, Heart, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, ArrowRight. Here's an example of importing and using one: import { Heart } from \"lucide-react\"\\` & \\<Heart className=\"\"  />\\. PLEASE ONLY USE THE ICONS IF AN ICON IS NEEDED IN THE USER'S REQUEST.\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"projectTitle\": \"Todo App\",\n  \"explanation\": \"This React project creates a simple todo application using Tailwind CSS for styling and lucide-react for icons. It features components for task input, task listing, and potentially task filtering/sorting, with tasks stored in the application state. Date formatting uses date-fns. The structure is designed for maintainability and scalability, separating concerns into individual components within dedicated folders.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\nimport TaskList from './components/TaskList';\\nimport TaskForm from './components/TaskForm';\\nimport { format } from 'date-fns';\\nimport { CheckCircle, Trash2 } from 'lucide-react';\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState(() => {\\n    const storedTasks = localStorage.getItem('tasks');\\n    return storedTasks ? JSON.parse(storedTasks) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('tasks', JSON.stringify(tasks));\\n  }, [tasks]);\\n\\n  const addTask = (text) => {\\n    setTasks([...tasks, { id: Date.now(), text, completed: false, createdAt: new Date() }]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  const clearCompletedTasks = () => {\\n    setTasks(tasks.filter(task => !task.completed));\\n  }\\n\\n  return (\\n    <div className=\\\"min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12\\\">\\n      <div className=\\\"relative py-3 sm:max-w-xl sm:mx-auto\\\">\\n        <div className=\\\"absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl\\\"></div>\\n        <div className=\\\"relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20\\\">\\n          <div className=\\\"max-w-md mx-auto\\\">\\n            <div>\\n              <h1 className=\\\"text-2xl font-semibold\\\">My Todo List 🚀</h1>\\n            </div>\\n            <TaskForm onAddTask={addTask} />\\n            <TaskList\\n              tasks={tasks}\\n              onToggleComplete={toggleComplete}\\n              onDeleteTask={deleteTask}\\n            />\\n             {tasks.filter(task => task.completed).length > 0 && (\\n                <button\\n                  onClick={clearCompletedTasks}\\n                  className=\\\"mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\"\\n                >\\n                  Clear Completed <Trash2 className=\\\"inline-block ml-2\\\"/>\\n                </button>\\n              )}\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/TaskForm.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction TaskForm({ onAddTask }) {\\n  const [text, setText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim()) {\\n      onAddTask(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"mt-6\\\">\\n      <div className=\\\"flex\\\">\\n        <input\\n          type=\\\"text\\\"\\n          className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\\"\\n          placeholder=\\\"Add a task...\\\"\\n          value={text}\\n          onChange={(e) => setText(e.target.value)}\\n        />\\n        <button\\n          type=\\\"submit\\\"\\n          className=\\\"ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\"\\n        >\\n          Add <Plus className=\\\"inline-block ml-2\\\"/>\\n        </button>\\n      </div>\\n    </form>\\n  );\\n}\\n\\nexport default TaskForm;\"\n    },\n    \"/components/TaskList.js\": {\n      \"code\": \"import React from 'react';\\nimport { format } from 'date-fns';\\nimport { CheckCircle, Trash2 } from 'lucide-react';\\n\\nfunction TaskList({ tasks, onToggleComplete, onDeleteTask }) {\\n  return (\\n    <ul className=\\\"mt-6\\\">\\n      {tasks.map(task => (\\n        <li key={task.id} className=\\\"flex items-center justify-between py-2 border-b border-gray-200\\\">\\n          <div className=\\\"flex items-center\\\">\\n            <button onClick={() => onToggleComplete(task.id)} className=\\\"mr-2\\\">\\n              {task.completed ? (\\n                <CheckCircle className=\\\"h-5 w-5 text-green-500\\\" />\\n              ) : (\\n                <div className=\\\"h-5 w-5 rounded-full border border-gray-400\\\"></div>\\n              )}\\n            </button>\\n            <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>\\n              {task.text} - {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}\\n            </span>\\n          </div>\\n          <button onClick={() => onDeleteTask(task.id)}>\\n            <Trash2 className=\\\"h-5 w-5 text-red-500\\\" />\\n          </button>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TaskList;\"\n    }\n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/TaskForm.js\",\n    \"/components/TaskList.js\"\n  ]\n}\n```"},
          ],
        },
      ],
})

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

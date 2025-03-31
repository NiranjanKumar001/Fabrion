"use client"
import ChatView from '@/components/custom/ChatView' 
import CodeView from '@/components/custom/CodeView'
import Sidebar from '@/components/custom/Sidebar'  // Adjust the path as needed
import React, { useState, useEffect } from 'react'

function Workspace() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    useEffect(() => {
        // Listen for the custom event from ChatView
        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev);
        };
        
        document.addEventListener('toggle-sidebar', handleToggleSidebar);
        
        return () => {
            document.removeEventListener('toggle-sidebar', handleToggleSidebar);
        };
    }, []);

    return (
        <div className='p-3 pr-5 mt-3 flex'>
            {/* Import the Sidebar component */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            
            {/* Main content */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 w-full transition-all duration-300 ${
                sidebarOpen ? 'md:ml-64' : 'ml-0'
            }`}>
                <ChatView />
                <div className='col-span-3'>
                    <CodeView />
                </div>
            </div>
        </div>
    )
}

export default Workspace;
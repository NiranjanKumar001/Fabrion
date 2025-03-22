"use client"
import React, { useContext, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from '@/context/MessagesContext'
function Provider({ children }) {
    const [messages, setMessages] = useState([]);

    return (
        <div>
            <MessagesContext.Provider value={{ messages, setMessages }}>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange>{children}</NextThemesProvider>
            </MessagesContext.Provider>
        </div>
    )
}

export default Provider
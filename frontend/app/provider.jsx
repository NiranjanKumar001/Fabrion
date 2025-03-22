"use client"
import React, { useContext, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
function Provider({ children }) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();

    return (
        <div>
            <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange>{children}</NextThemesProvider>
            </MessagesContext.Provider>
            </UserDetailContext.Provider>
        </div>
    )
}

export default Provider
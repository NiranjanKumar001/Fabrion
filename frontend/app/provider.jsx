"use client"
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
function Provider({ children }) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();
    const convex =useConvex();

    // we want  to use the use effect only once so this is the command
    useEffect(() => {
        isAuthenticated();
    }, [])

    const isAuthenticated = async() => {
        if (typeof window !== undefined) {
            //fetch the datat from the database
            const user = JSON.parse(localStorage.getItem('user'));
            const result=await convex.query(api.users.GetUser,{
                email:user?.email
            })
            setUserDetail(result);
            // console.log(result);
        }
    }

    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_KEY}>
                <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                    <MessagesContext.Provider value={{ messages, setMessages }}>
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange>{children}</NextThemesProvider>
                    </MessagesContext.Provider>
                </UserDetailContext.Provider>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Provider
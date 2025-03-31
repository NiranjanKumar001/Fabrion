"use client"
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
// import { SidebarProvider } from '@/components/ui/sidebar';
// import { AppSidebar } from '@/components/custom/AppSideBar';

function Provider({ children }) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const convex = useConvex();
    
    // Initialize authentication check when component mounts
    useEffect(() => {
        checkAuthentication();
    }, []);
    
    const checkAuthentication = async() => {
        try {
            setIsLoading(true);
            
            // Check if we're in a browser environment
            if (typeof window !== 'undefined') {
                const user = localStorage.getItem('user');
                
                if (user) {
                    const userData = JSON.parse(user);
                    
                    // Only query Convex if we have an email
                    if (userData?.email) {
                        const result = await convex.query(api.users.GetUser, {
                            email: userData.email
                        });
                        
                        if (result) {
                            console.log("User authenticated from database:", result);
                            setUserDetail(result);
                        } else {
                            console.log("User not found in database");
                            // Clear localStorage if user doesn't exist in database
                            localStorage.removeItem('user');
                            setUserDetail(null);
                        }
                    } else {
                        console.log("No email found in stored user data");
                        setUserDetail(null);
                    }
                } else {
                    console.log("No user found in localStorage");
                    setUserDetail(null);
                }
            }
        } catch (error) {
            console.error("Authentication check error:", error);
            setUserDetail(null);
        } finally {
            setIsLoading(false);
        }
    }
    
    // Effect to save user data to localStorage when it changes
    useEffect(() => {
        if (userDetail && typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userDetail));
        }
    }, [userDetail]);

    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_KEY}>
                <UserDetailContext.Provider value={{ 
                    userDetail, 
                    setUserDetail, 
                    isAuthLoading: isLoading,
                    refreshAuth: checkAuthentication 
                }}>
                    <MessagesContext.Provider value={{ messages, setMessages }}>
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange>
                            
                            {/* <SidebarProvider defaultOpen={false}>
                                <AppSidebar/> */}
                            {children}
                            {/* </SidebarProvider> */}
                        </NextThemesProvider>
                    </MessagesContext.Provider>
                </UserDetailContext.Provider>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Provider
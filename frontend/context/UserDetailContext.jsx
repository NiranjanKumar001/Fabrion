"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@react-oauth/google';

export const UserDetailContext = createContext();

export default function UserDetailContextProvider({ children }) {
    const [userDetail, setUserDetail] = useState(null);
    const { userId, isSignedIn, user } = useAuth();
    
    // Use Convex query to get user details
    const userData = useQuery(api.users.GetUser, 
        isSignedIn && user?.emailAddresses?.[0]?.emailAddress 
            ? { email: user.emailAddresses[0].emailAddress } 
            : null
    );
    
    useEffect(() => {
        console.log("Auth state:", { userId, isSignedIn });
        console.log("User data from query:", userData);
        
        if (userData) {
            console.log("Setting user detail from query:", userData);
            setUserDetail(userData);
        }
    }, [userData, userId, isSignedIn]);
    
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    );
}
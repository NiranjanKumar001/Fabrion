import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google';
import { UserDetailContext } from '@/context/UserDetailContext';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import uuid4 from "uuid4";

function SignInDialog({ openDialog, closeDialog, onSignInSuccess }) {
    const { userDetail, setUserDetail, refreshAuth } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreateUser);
    
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
                );
                
                const user = userInfo.data;
                
                // Create user in database
                const createdUser = await CreateUser({
                    name: user?.name,
                    email: user?.email,
                    picture: user?.picture,
                    uid: uuid4(),
                });
                
                // Store user data in localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                
                // Update user detail in context
                setUserDetail(createdUser || user);
                
                // Call refresh auth function to update auth state
                if (refreshAuth) {
                    refreshAuth();
                }
                
                // Call onSignInSuccess if provided
                if (onSignInSuccess) {
                    onSignInSuccess();
                }
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                // You could add an error message to the user here
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const handleSignInClick = () => {
        // Close the dialog immediately
        closeDialog(false);
        
        // Then trigger the Google login process
        googleLogin();
    };
    
    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
                    <DialogDescription>{Lookup.SIGNIN_SUBHEADING}</DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col items-center justify-center gap-3">
                    <Button 
                        className='bg-blue-500 text-white hover:bg-blue-400 mt-3' 
                        onClick={handleSignInClick}
                    >
                        Sign In With Google
                    </Button>
                    
                    <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog;
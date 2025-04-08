import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
// import { Button } from '../ui/button'
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
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
                );
                
                const user = userInfo.data;
                
                const createdUser = await CreateUser({
                    name: user?.name,
                    email: user?.email,
                    picture: user?.picture,
                    uid: uuid4(),
                });
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                
                setUserDetail(createdUser || user);
                
                if (refreshAuth) {
                    refreshAuth();
                }
                
                if (onSignInSuccess) {
                    onSignInSuccess();
                }
            } catch (error) {
                console.error("Error during Google sign-in:", error);
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const handleSignInClick = () => {
        closeDialog(false);
        
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
                    <button 
                        type="button"
                        onClick={handleSignInClick}
                        className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 shadow-sm w-64 transition-colors"
                    >
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        <span className="font-medium">Sign in with Google</span>
                    </button>
                    
                    <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog;
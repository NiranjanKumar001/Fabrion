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


function SignInDialog({ openDialog, closeDialog }) {

    const { userDetail, setUserDetail } = useContext(UserDetailContext); //no props drillling required to access value over here
    const CreateUser = useMutation(api.users.CreateUser);


// useMutation helps with:
// Sending API requests (POST, PUT, DELETE)
//  Handling loading, error, and success states
//  Automatically retrying failed requests

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );


            // console.log(userInfo);
            const user = userInfo.data;

            await CreateUser({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4(),
            })


            if (typeof window !== undefined) {
                localStorage.setItem('user', JSON.stringify())
            }

            localStorage.setItem('user', JSON.stringify(userInfo?.data))

            setUserDetail(userInfo?.data)

            //save this inside a database
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });


    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
                    <DialogDescription>{Lookup.SIGNIN_SUBHEADING}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-3">
                    <Button className='bg-blue-500 text-white hover:bg-blue-400 mt-3' onClick={googleLogin}>
                        Sign In With Google
                    </Button>

                    <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog;
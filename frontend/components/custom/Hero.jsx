"use client"
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import SignInDialog from './SignInDialog';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

//requires debugging for future check this out

function Hero() {
    const [userInput, setUserInput] = useState();

    const { messages, setMessages } = useContext(MessagesContext);

    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const [openDialog,setOpenDialog] =useState(false) ;

    const CreateWorkSpace =useMutation(api.workspace.CreateWorkspace);

    const router =useRouter();

    const onGenerate = async(input) => {
        if (!userDetail?.name) {
            setOpenDialog(true);
            return;
        }

        const msg ={
            role: 'user',
            content: input
        }
        setMessages(msg);
        // setMessages((prev) => Array.isArray(prev) ? [...prev, msg] : [msg]);

        const workspaceId=await CreateWorkSpace({
            user:userDetail._id,
            messages:[msg]
            //made the message in array sso that in future we have to map it so that it could be done properly
            //.map only supports array or valid data.
        }); 
        // console.log(workspaceId)
        router.push('/workspace/'+workspaceId);
    }
    return (
        <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2 ">
            <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
            <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{
                backgroundColor: Colors.BACKGROUND
            }}>
                <div className='flex gap-2'>
                    <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
                        onChange={(event) => setUserInput(event.target.value)}
                        className='outline-none bg-transparent w-full h-32 max-h-56 resize-none ' />
                    {userInput && <ArrowRight
                        onClick={() => onGenerate(userInput)}
                        className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer' />}
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
            <div className='flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8'>
                {Lookup.SUGGSTIONS.map((suggestion, index) => (
                    <h2 key={index}
                        onClick={() => onGenerate(suggestion)}
                        className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer'>{suggestion}</h2>
                ))}
            </div>
            <SignInDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(v)}/>
        </div>
    )
}

export default Hero;
"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import React, { useContext, useEffect } from 'react'

function WorkspaceHistory() {
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    const convex=useConvex();

    useEffect(()=>{
        userDetail&&GetAllWorkspace();
    },[userDetail])

    const GetAllWorkspace=async()=>{
        const result=await convex.query(api.workspace.GetAllWorkspace,{
            userId:userDetail?._id
        })
        console.log(result)
    }
    return (
        <div>
            <h2 className='font-medium text-lg'>Your Chats</h2>
        </div>
    )
}

export default WorkspaceHistory
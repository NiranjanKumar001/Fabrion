"use client" 
import Colors from '@/data/Colors'; 
import Lookup from '@/data/Lookup' 
import { ArrowRight, Link } from 'lucide-react' 
import React, { useContext, useState, useEffect } from 'react' 
import SignInDialog from './SignInDialog'; 
import { MessagesContext } from '@/context/MessagesContext'; 
import { UserDetailContext } from '@/context/UserDetailContext'; 
import { useMutation, useQuery } from 'convex/react'; 
import { api } from '@/convex/_generated/api'; 
import { useRouter } from 'next/navigation'; 
 
function Hero() { 
    const [userInput, setUserInput] = useState('');
    const [isUserReady, setIsUserReady] = useState(false);
 
    const { messages, setMessages } = useContext(MessagesContext); 
    const { userDetail, setUserDetail } = useContext(UserDetailContext); 
    const [openDialog, setOpenDialog] = useState(false);
 
    const CreateWorkSpace = useMutation(api.workspace.CreateWorkspace); 
    const router = useRouter(); 
    
    // Add an effect to check if user data is ready
    useEffect(() => {
        if (userDetail && userDetail._id) {
            console.log("User detail loaded");
            setIsUserReady(true);
        } else {
            console.log("Waiting for user detail...");
            setIsUserReady(false);
        }
    }, [userDetail]);
 
    const onGenerate = async(input) => { 
        // console.log("onGenerate called with input:", input);
        // console.log("Current userDetail:", userDetail);
        
        // First check if user is logged in
        if (!userDetail?.name) { 
            // console.log("No user name found, opening dialog");
            setOpenDialog(true); 
            return; 
        } 
 
        // Create the message object
        const msg = {
            role: 'user', 
            content: input 
        };
        
        // Make sure userDetail and userDetail._id exist and are valid
        if (!userDetail || !userDetail._id) {
            // console.log("User ID is missing or invalid:", userDetail);
            setOpenDialog(true);
            return;
        }
        
        // Update messages state
        setMessages(msg);
        
        try {
            // console.log("Creating workspace with user ID:", userDetail._id);
            // console.log("Message being sent:", [msg]);
            
            // Call CreateWorkSpace with proper error handling
            const workspaceId = await CreateWorkSpace({
                user: userDetail._id,
                messages: [msg]
            });
            
            if (workspaceId) {
                console.log("Workspace created successfully:", workspaceId);
                router.push('/workspace/' + workspaceId);
            } else {
                console.error("Failed to create workspace, no ID returned");
            }
        } catch (error) {
            console.error("Error creating workspace:", error);
            // You could add a user notification here
        }
    } 
    
    // Add this function to handle suggestion clicks
    const handleSuggestionClick = (suggestion) => {
        console.log("Suggestion clicked:", suggestion);
        console.log("Current user state:", userDetail);
        onGenerate(suggestion);
    };
    
    return ( 
        <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2 "> 
            <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2> 
            <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p> 
            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{ 
                backgroundColor: Colors.BACKGROUND 
            }}> 
                <div className='flex gap-2'> 
                    <textarea 
                        placeholder={Lookup.INPUT_PLACEHOLDER} 
                        onChange={(event) => setUserInput(event.target.value)} 
                        className='outline-none bg-transparent w-full h-32 max-h-56 resize-none ' 
                    /> 
                    {userInput && (
                        <ArrowRight 
                            onClick={() => onGenerate(userInput)} 
                            className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer' 
                        />
                    )} 
                </div> 
                <div> 
                    <Link className='h-5 w-5' /> 
                </div> 
            </div> 
            
            {/* Show user status for debugging */}
            <div className="text-xs text-gray-500 mt-2">
                {isUserReady ? "User authenticated" : "User not authenticated"}
            </div>
            
            <div className='flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8'> 
                {Lookup.SUGGSTIONS.map((suggestion, index) => ( 
                    <h2 
                        key={index} 
                        onClick={() => handleSuggestionClick(suggestion)} 
                        className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer'
                    >
                        {suggestion}
                    </h2> 
                ))} 
            </div> 
            <SignInDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(v)}/> 
        </div> 
    ) 
} 
 
export default Hero;
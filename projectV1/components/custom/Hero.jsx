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
    const { userDetail, setUserDetail, isAuthLoading, refreshAuth } = useContext(UserDetailContext); 
    const [openDialog, setOpenDialog] = useState(false);

    const CreateWorkSpace = useMutation(api.workspace.CreateWorkspace); 
    const router = useRouter(); 
    
    useEffect(() => {
        if (!isAuthLoading && userDetail && userDetail._id) {
            console.log("User authenticated and ready");
            setIsUserReady(true);
        } else if (!isAuthLoading) {
            console.log("User not authenticated");
            setIsUserReady(false);
        }
    }, [userDetail, isAuthLoading]);
 
    const onGenerate = async(input) => { 
        if (isAuthLoading) {
            console.log("Authentication is still loading, please wait");
            return;
        }
        
        if (!userDetail?._id) { 
            console.log("User not authenticated, opening sign-in dialog");
            setOpenDialog(true); 
            return; 
        } 
 
        const msg = {
            role: 'user', 
            content: input 
        };
        
        setMessages(msg);
        
        try {
            console.log("Creating workspace with user ID");
            
            const workspaceId = await CreateWorkSpace({
                user: userDetail._id,
                messages: [msg]
            });
            
            if (workspaceId) {
                console.log("Workspace created successfully");
                router.push('/workspace/' + workspaceId);
            } else {
                console.error("Failed to create workspace, no ID returned");
            }
        } catch (error) {
            console.error("Error creating workspace:", error);
            // You could add a user notification here
        }
    } 
    
    const handleSuggestionClick = (suggestion) => {
        onGenerate(suggestion);
    };

    const handleSignInSuccess = () => {
        refreshAuth(); // Refresh auth state after sign-in
    };
    // check
    
    return ( 
        <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2 " >
            <h2 className='font-bold text-4xl text-[#F6F1E9]'>{Lookup.HERO_HEADING}</h2>
            <p className='text-[#ffffff] font-medium'>{Lookup.HERO_DESC}</p>
            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{ 
                backgroundColor: Colors.BACKGROUND ,
                border: '2px solid #fff' 
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
                            className='bg-amber-500 p-2 h-10 w-10 rounded-md cursor-pointer' 
                        />
                    )}
                </div> 
                <div> 
                    <Link className='h-5 w-5' /> 
                </div> 
            </div> 
            
            <div className="text-xs text-[#ffffff] mt-2">
                {isAuthLoading ? "Checking authentication..." : 
                 isUserReady ? "User authenticated" : "User not authenticated"}
            </div>
            
            <div className='flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8'> 
                {Lookup.SUGGSTIONS.map((suggestion, index) => ( 
                    <h2 
                        key={index} 
                        onClick={() => handleSuggestionClick(suggestion)} 
                        className='p-1 px-2 border-white border-2 rounded-full text-sm text-white cursor-pointer'
                    >
                        {suggestion}
                    </h2> 
                ))} 
            </div> 

            <SignInDialog 
                openDialog={openDialog} 
                closeDialog={(v) => setOpenDialog(v)}
                onSignInSuccess={handleSignInSuccess}
            />         
        </div> 


// redesign
/* <section className="flex flex-col px-16 max-md:px-8 max-sm:px-5">
      <div className="flex gap-16 justify-between items-center max-md:flex-col">
        <div className="flex flex-col gap-9 max-w-[600px]">
          <h1 className="text-7xl font-semibold leading-[94px] text-zinc-900 max-md:text-6xl max-md:leading-[70px] max-sm:text-4xl max-sm:leading-10">
            Build your website
          </h1>
          <p className="text-3xl font-medium leading-10 text-zinc-700 max-md:text-2xl max-md:leading-9 max-sm:text-xl max-sm:leading-8">
            We create custom websites to help businesses grow and succeed
            online.
          </p>
          <button className="text-3xl font-semibold bg-blue-500 rounded-2xl border border-blue-600 h-[75px] text-slate-200 w-[228px]">
            Get Started
          </button>
        </div>
        <div className="relative h-[507px] w-[691px] max-md:w-full max-md:h-auto">
          <img
          src="/images/Groups.png"
            alt="Website building illustration"
            className="w-full h-full rounded-[25px] border-[2px] border-[#000]"
          />
        </div>

        
      </div>
    </section> */

    ) 
} 

export default Hero;
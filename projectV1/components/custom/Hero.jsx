"use client" 
import Colors from '@/data/Colors'; 
import Lookup from '@/data/Lookup' 
import { ArrowRight, Link, Paperclip, Sparkles } from 'lucide-react' 
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
        }
    } 
    
    const handleSuggestionClick = (suggestion) => {
        onGenerate(suggestion);
    };
 
    const handleSignInSuccess = () => {
        refreshAuth();
    };
    
    return ( 
        <div className="flex flex-col items-center mt-20 md:mt-32 px-4 max-w-4xl w-full text-center" >
            {/* Visual highlight tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs font-semibold mb-6 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini 2.0 Flash Enabled</span>
            </div>

            {/* Typography Title */}
            <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent max-w-2xl leading-tight">
                {Lookup.HERO_HEADING}
            </h1>
            
            <p className="text-zinc-400 text-base sm:text-lg font-medium mt-4 max-w-lg leading-relaxed">
                {Lookup.HERO_DESC}
            </p>

            {/* Prompt Input Container */}
            <div className="w-full max-w-2xl mt-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-zinc-800/80 focus-within:border-cyan-500/40 focus-within:ring-4 focus-within:ring-cyan-500/5 p-4 flex flex-col gap-3"> 
                <textarea 
                    placeholder={Lookup.INPUT_PLACEHOLDER} 
                    onChange={(event) => setUserInput(event.target.value)}
                    value={userInput}
                    className="outline-none bg-transparent w-full h-24 max-h-56 resize-none text-zinc-100 placeholder-zinc-500 text-sm leading-relaxed" 
                /> 
                
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <div className="flex gap-2">
                        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer" title="Attach file">
                            <Paperclip className="h-4.5 w-4.5" />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer" title="Add link">
                            <Link className="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <button 
                        onClick={() => userInput.trim() && onGenerate(userInput)}
                        disabled={!userInput.trim()}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                            userInput.trim() 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95' 
                            : 'bg-zinc-900 text-zinc-650 cursor-not-allowed'
                        }`}
                        title="Generate code"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div> 
            </div> 
            
            {/* Minimalist Auth Indicator */}
            <div className="text-xs font-semibold text-zinc-500 mt-4 tracking-wide uppercase">
                {isAuthLoading ? "Verifying Session..." : 
                 isUserReady ? "● Active Developer Session" : "○ Local Environment Mode"}
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl"> 
                {Lookup.SUGGSTIONS.map((suggestion, index) => ( 
                    <button 
                        key={index} 
                        onClick={() => handleSuggestionClick(suggestion)} 
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 bg-zinc-900/30 border border-white/5 hover:border-zinc-700 hover:bg-zinc-800/40 hover:text-zinc-150 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        {suggestion}
                    </button> 
                ))} 
            </div> 

            <SignInDialog 
                openDialog={openDialog} 
                closeDialog={(v) => setOpenDialog(v)}
                onSignInSuccess={handleSignInSuccess}
            />         
        </div> 
    ) 
} 

export default Hero;
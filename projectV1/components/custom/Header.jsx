"use client";
import React, { useContext, useState } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog';
import ProfileModal from './ProfileModal';
import { Github, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const router = useRouter();

    const handleSignOut = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            setUserDetail(null);
            router.push('/');
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-[#030303]/70 backdrop-blur-md px-6 py-3 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-inner transition-all duration-300 group-hover:border-cyan-500/30">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <svg className="w-4 h-4 text-cyan-400 transition-all duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" className="stroke-cyan-400" />
                                <path d="M2 17l10 5 10-5" className="stroke-indigo-400 opacity-85" />
                                <path d="M2 12l10 5 10-5" className="stroke-purple-400 opacity-70" />
                            </svg>
                        </div>
                        <span className="text-lg font-extrabold tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300">
                            Fabrion
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <a 
                        href="https://github.com/NiranjanKumar001/Fabrion" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-350 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all shadow-inner"
                    >
                        <Github className="w-3.5 h-3.5" />
                        <span>Star on GitHub</span>
                    </a>

                    {userDetail ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setOpenProfile(true)}
                                className="flex items-center gap-2 p-1 pr-3 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-full hover:bg-zinc-900 transition-all cursor-pointer shadow-inner"
                            >
                                <img 
                                    src={userDetail?.picture || "https://api.dicebear.com/7.x/bottts/svg?seed=fabrion"} 
                                    alt={userDetail?.name} 
                                    className="w-6 h-6 rounded-full border border-white/10" 
                                />
                                <span className="max-w-[80px] truncate">{userDetail?.name || 'User'}</span>
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setOpenSignIn(true)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/25 transition-all cursor-pointer"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            <SignInDialog
                openDialog={openSignIn}
                closeDialog={(v) => setOpenSignIn(v)}
            />

            <ProfileModal
                isOpen={openProfile}
                onClose={() => setOpenProfile(false)}
            />
        </>
    );
}

export default Header;

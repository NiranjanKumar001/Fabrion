import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button.jsx'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext.jsx';
import { Stars } from 'lucide-react';

function Header() {

    const { userDetail, setUserDetail } = useContext(UserDetailContext);


    return (
        <div className='p-4 flex justify-between'>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            {!userDetail ? (
                    <>
                        <Button className="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-300">
                            Sign in
                        </Button>
                        <Button style={{ backgroundColor: Colors.BLUE }}>
                            Get Started
                        </Button>
                    </>
                ) : (
                    <Button className="border border-gray-500 text-gray-500 hover:bg-blue-400 hover:text-white transition-all duration-300">
                        <Stars/>
                        Dashboard
                    </Button>
                )}
        </div>
    )
}

export default Header

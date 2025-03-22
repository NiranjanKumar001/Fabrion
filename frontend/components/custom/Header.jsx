import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button.jsx'
import Colors from '@/data/Colors'

function Header() {
    return (
        <div className='p-4 flex justify-between items-center'>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <div className='flex gap-5'>
                <Button className="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-300">
                    Sign in
                </Button>
                <Button style={{
                    backgroundColor: Colors.BLUE
                }}>
                    Get Started
                </Button>
            </div>
        </div>
    )
}

export default Header

import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button.jsx'
import Colors from '@/data/Colors'
// import { UserDetailContext } from '@/context/UserDetailContext.jsx';
// import { Stars } from 'lucide-react';

function Header() {

    // const { userDetail, setUserDetail } = useContext(UserDetailContext);


    return (
        <div className='p-4 flex justify-between items-center'>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            {/* {!userDetail ? (
                    <> */}
                        <div className='items-end space-x-5'>
                        <Button className="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-300">
                            About
                        </Button>
                        <Button style={{ backgroundColor: Colors.BLUE }}>
                            Documentation
                        </Button>
                        </div>
                    {/* </>
                ) : ( */}
                    {/* <Button className="border border-gray-500 text-gray-500 hover:bg-blue-400 hover:text-white transition-all duration-300">
                        <Stars/>
                        Dashboard
                    </Button> */}
                {/* )} */}
        </div>
    )
}

export default Header

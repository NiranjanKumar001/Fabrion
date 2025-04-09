import React, { useContext } from 'react'
// import Image from 'next/image'
// import { UserDetailContext } from '@/context/UserDetailContext.jsx';
// import { Stars } from 'lucide-react';

function Header() {

    // const { userDetail, setUserDetail } = useContext(UserDetailContext);


    return (
        <header className="flex justify-between items-center px-16 py-8 max-md:px-8 max-sm:px-5">
      <img src="/logo.png" alt="Company logo" className="w-[59px] h-[64px]" />

      <nav className="flex gap-11 items-center max-md:hidden">
        <a href="#about" className="text-2xl font-medium text-zinc-700">
          About
        </a>
        <a href="#services" className="text-2xl font-medium text-zinc-700">
          Services
        </a>
        <a href="#contact" className="text-2xl font-medium text-neutral-700">
          Contact
        </a>
        <button className=" h-16 text-2xl font-medium text-gray-800 bg-white rounded-2xl border-blue-500 border-[3px] w-[197px]">
          Github Star
        </button>
      </nav>

      <button className="hidden text-3xl max-md:block" aria-label="Menu">
        <i className="ti ti-menu-2" />
      </button>
    </header>
    )
}

export default Header

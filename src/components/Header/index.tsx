'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { redirect } from "next/navigation";

function LoanInvestmentSwitch() {

  return (
    <div className="flex items-center space-x-2">
    
    </div>
  )

}

function ProfilePicDropdown() {

  const logOut = async () => {

    console.log("log out clicked")

    const response = await fetch('/api/session', {
      method: 'DELETE',
    })

    if (response.ok) {
      redirect('/')
    }

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Image src='/user.svg' alt='pfp' width={40} height={40} className="rounded-full border-1 border-none hover:scale-105 border-black transition-all"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

}

export default function Header({ userLoggedIn }: { userLoggedIn: boolean}) {
  
  return (
    <header className="fixed top-0 left-0 w-full h-18 z-10">
      <div className="flex items-center justify-between w-full h-full px-22
        bg-gradient-to-t from-transparent to-[#E8D7FF] backdrop-blur-md">
        <div className="flex flex-row space-x-5">
          <div className="flex flex-row">
            <div className="font-bold text-2xl text-purple-500">Pinjam</div>
            <div className="font-bold text-2xl">DAO</div>
          </div>
        </div>
        {
          userLoggedIn && <div className="flex flex-row space-x-5">
          <LoanInvestmentSwitch />
          <ProfilePicDropdown />
        </div>
        }
        
      </div>
      <hr className="border-1 border-gray-200"/>
    </header>
  )
}
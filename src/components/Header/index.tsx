import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "../ui/switch";

function LoanInvestmentSwitch() {

  return (
    <div className="flex items-center space-x-2">
    
    </div>
  )

}

function ProfilePicDropdown() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <motion.div className="size-10 rounded-full bg-amber-400 border-1 border-none hover:border-solid border-black transition-all"
          ></motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

}

export default function Header() {
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
        <div className="flex flex-row space-x-5">
          <LoanInvestmentSwitch />
          <ProfilePicDropdown />
        </div>
      </div>
      <hr className="border-1 border-gray-200"/>
    </header>
  )
}
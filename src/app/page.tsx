'use client'

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import Header from "@/components/Header";
import WorldIDLogin from "@/components/WorldIDLogin";

function Slogan() {
  
  const keywords = ['Simple', 'Secure', 'Swift']
  const duration = 3000
  const [currKeywordIndex, setCurrKeywordIndex] = useState(0)
  const [trigger, setTrigger] = useState(false)

  const interval = setInterval(() => {
    setCurrKeywordIndex((currKeywordIndex + 1) % keywords.length);
  }, duration)

  return (
    <div className="text-black text-[5rem] font-extrabold text-right">
      <h1 className="">Microloans</h1>
      <h1 className="">Made</h1>
      <AnimatePresence mode="wait">
        <motion.div
        key={currKeywordIndex}
        className="text-[#6E61E3]"
        variants={{
          
        }}
        initial={{
          opacity: 0,
          translateX: -200,
        }}
        animate={{
          opacity: 1,
          translateX: 0,
        }}
        exit={{
          opacity: 0,
        }}
        >
          {keywords[currKeywordIndex]}.
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Login() {
  return (
    <div className="flex h-32 w-[20rem] bg-[#6E61E3]/40 rounded-xl shadow-lg items-center justify-center">
      <WorldIDLogin />
    </div>
  )
}


export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#EFF8FC] justify-center items-center">
      <Header />
      <div className="flex flex-row w-full justify-evenly items-center">
        <Slogan />
        <Login />
      </div>
    </div>
  );
}
'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoanInfoCard from "@/components/LoanInfoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import Modal from "@/components/Modal";

function LoanInfoCarousel() {

  return (
    <Carousel
    className="flex justify-center w-[95%]"
    opts={{
      align: 'center',
      loop: true
    }}>
      <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index} className="basis-1/4">
                <LoanInfoCard />
              </CarouselItem>
          ))}
        </CarouselContent>
      <CarouselNext />
    </Carousel>
  )

}

function HistoryCard() {
  return (
    <div className="flex flex-row justify-between h-24 px-5">
      <div className="flex flex-row space-x-5">
        <div className="flex items-center justify-center">
          <div className="size-16 bg-amber-400 rounded-full"></div>
        </div>
        <div className="flex flex-col space-y-2 justify-center">
          <div className="font-semibold text-2xl">Title</div>
          <div className="font-base text-xl">Subtitle</div>
        </div>
      </div>
      <div className="flex flex-col justify-center font-semibold text-2xl">Amount</div>
    </div>
  )

}

function NewLoanApplicationDialog() {

  return(
    <Dialog>
      <DialogTrigger>
        <motion.div
          className="flex items-center justify-center w-48 h-12 bg-[#5202DB] rounded-lg text-white font-semibold text-lg cursor-pointer select-none"
          whileHover={{
            scale: 1.1
          }}
          whileTap={{
            scale: 0.9
          }}
          >
            New Loan
        </motion.div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )

}


export default function Dashboard() {

  const username = "User"

  const balance = 10000
  const currency = "USDC"

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#EFF8FC] items-center">
      <Header userLoggedIn={true}/>
      <div className="flex-grow p-12 w-full">
        <div className="flex flex-col space-y-8 w-full">
          <div className="px-10 mt-16 font-semibold text-black text-5xl">Welcome back, {username}!</div>
          <div className="flex flex-col space-y-5 px-10">
            <div className="font-semibold text-black text-4xl">Total Balance</div>
            <div className="flex flex-row justify-start items-end space-x-5">
              <div className="font-bold text-black text-6xl">{balance.toLocaleString()} USDC</div>
                <motion.button
                  className="flex justify-center w-12 h-12 bg-[#5202DB] rounded-full text-white font-semibold text-4xl text-center cursor-pointer select-none"
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.9
                  }}
                >
                  +
                </motion.button>
            </div>
          </div>
          <hr className="border-2 border-gray-200 mx-10 rounded-full mt-2 mb-10"/>
          <div className="flex flex-row justify-between px-10">
            <div className="text-black text-3xl font-bold">Recent Loans</div>
            <NewLoanApplicationDialog />
          </div>
          <div className="flex justify-center">
            <LoanInfoCarousel />
          </div>
          <div className="flex flex-row justify-between px-10 py-6">
            
            <div className="flex flex-col space-y-5 w-[45%]">
              <div className="text-black text-3xl font-bold">History</div>
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
            </div>
            <div className="w-1 h-auto border-2 border-gray-200 rounded-full mt-16"/>
            <div className="flex flex-col space-y-12 w-[45%]">
              <div className="text-black text-3xl font-bold">Credit Standing</div>
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-xl">Loan Frequency</div>
                <Progress value={10} className="h-4"/> 
              </div>
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-xl">Loan Repayment</div>
                <Progress value={30} className="h-4"/> 
              </div>
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-xl">Loan Utilization</div>
                <Progress value={90} className="h-4"/> 
              </div>
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-xl">Loan History</div>
                <Progress value={45} className="h-4"/> 
              </div>
            </div>


          </div>
          
        </div>
      </div>
      <Footer />

    </div>
  )
}
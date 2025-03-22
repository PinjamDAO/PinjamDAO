'use client'

import Header from "@/components/Header";
import LoanInfoCard from "@/components/LoanInfoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { motion } from "motion/react";
import { i } from "motion/react-client";

function LoanInfoCarousel() {

  const loans = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

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

export default function Dashboard() {

  const username = "User"

  const balance = 10000
  const currency = "USDC"


  return (
    <div className="flex flex-col h-screen w-screen bg-[#EFF8FC] items-center">
      <Header />
      <div className="p-12 w-full">
        <div className="flex flex-col space-y-8 w-full">
          <div className="px-10 font-semibold text-black text-5xl">Welcome back, {username}!</div>
          <div className="flex flex-col space-y-5 px-10">
            <div className="font-semibold text-black text-4xl">Total Balance</div>
            <div className="flex flex-row justify-start items-end space-x-5">
              <div className="font-bold text-black text-6xl">{balance.toLocaleString()} USDC</div>
                <motion.button
                  className="flex justify-center w-12 h-12 bg-[#4b48fd] rounded-full text-white font-semibold text-4xl text-center cursor-pointer select-none"
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
          <div className="flex flex-row justify-between px-10">
            <div className="text-black text-3xl font-bold">Recent Loans</div>
            <motion.button
            className="w-48 h-12 bg-[#4b48fd] rounded-lg text-white font-semibold text-lg cursor-pointer select-none"
            whileHover={{
              scale: 1.1
            }}
            whileTap={{
              scale: 0.9
            }}
            >
              New Loan
            </motion.button>
          </div>
          <div className="flex justify-center">
            <LoanInfoCarousel />
          </div>
          <div className="flex flex-row justify-between px-10">
            <div className="text-black text-3xl font-bold">History</div>
          </div>
        </div>
      </div>
    </div>
  )
}
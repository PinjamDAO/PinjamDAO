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

import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from "react";
import { browser } from "process";
import { set } from "mongoose";

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

function AddFundsDialog() {

  const { Canvas } = useQRCode()

  const addr = "address"

  return(
    <Dialog>
      <DialogTrigger>
        <motion.div
          className="flex justify-center w-12 h-12 bg-[#5202DB] rounded-full text-white font-semibold text-4xl text-center cursor-pointer select-none"
          whileHover={{
            scale: 1.1
          }}
          whileTap={{
            scale: 0.9
          }}
        >
          +
        </motion.div>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl text-black pt-5">Add money</DialogTitle>
        </DialogHeader>
        <Canvas
          text={addr}
          options={{
            errorCorrectionLevel: 'M',
            margin: 1,
            scale: 8,
            width: 400,
            color: {
              dark: '#5202DB',
              light: '#EFF8FC',
            },
          }}
        />
        <div className="font-semibold text-xl px-10 text-center">Scan the QR Code with your crypto wallet such as Metamask.</div>
      </DialogContent>
    </Dialog>
  )

}

function NewLoanApplicationDialog() {

  const [open, setOpen] = useState(false)
  const [borrowAmount, setBorrowAmount] = useState(0)
  const [collateralAmount, setCollateralAmount] = useState(0)

  const annualInterest = 15
  const repaymentDurationMonths = 1

  const [ETHToUSDPrice, setETHToUSDPrice] = useState(0)

  useEffect(() => {

    fetch('https://hermes.pyth.network/api/latest_price_feeds?ids[]=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', {
      method: 'GET',
    }).then((resp) => {
      if (resp.ok) {
        return resp.json().then((json) => setETHToUSDPrice(json[0].price.price * Math.pow(10, json[0].price.expo)))
      }
    })

  }, [])

  const getAnnualInterest = () => {
    return (annualInterest)
  }

  const getRepaymentDurationMonths = () => {
    return (repaymentDurationMonths)
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl text-black pt-5">New Loan Application</DialogTitle>
        </DialogHeader>
          <div className="flex flex-col space-y-3">
            <div className="flex text-black font-semibold text-2xl pl-2">I want to borrow</div>
            <div className="flex flex-row justify-center items-center bg-white w-96 h-16 px-5
            rounded-lg inset-shadow-sm inset-shadow-indigo-200 text-black font-semibold text-2xl">
              <input className="flex w-72 h-16 p-2 focus:outline-0" type="number" onChange={(e) => setBorrowAmount(Number(e.target.value))}/>
              <div className="">USDC</div>
            </div>
          </div>
          <hr className="w-[90%] border-2 border-gray-200 mx-10 rounded-full mt-2 mb-10"/>
          <div className="flex flex-col space-y-3 w-[80%] text-xl pb-5">
            <div className="flex text-black font-bold text-3xl">Loan Details</div>
            <div className="flex flex-row justify-between items-center">
              <div>Amount to borrow:</div>
              <div>{borrowAmount} USDC</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div>Collateral:</div>
              <div>{(borrowAmount / ETHToUSDPrice).toFixed(6)} ETH</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div>Annual Interest:</div>
              <div>{getAnnualInterest()}%</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div>Repayment duration:</div>
              <div>{getRepaymentDurationMonths()} Months</div>
            </div>
          </div>
            <motion.div
            className="flex items-center justify-center w-48 h-12 bg-[#5202DB] rounded-lg text-white font-semibold text-lg cursor-pointer select-none"
            whileHover={{
              scale: 1.1
            }}
            whileTap={{
              scale: 0.9
            }}
            >
              Apply
          </motion.div>
      </DialogContent>
    </Dialog>
  )

}


export default function Dashboard() {

  const username = "User"

  const usdcBalance = 10000
  const ethBalance = 200
  const currency = "USDC"

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#EFF8FC] items-center">
      <Header userLoggedIn={true}/>
      <div className="flex-grow p-12 w-full">
        <div className="flex flex-col space-y-8 w-full">
          <div className="px-10 mt-16 font-semibold text-black text-5xl">Welcome back, {username}!</div>
          <div className="flex flex-col space-y-5 px-10">
            <div className="font-semibold text-black text-4xl">Total Balance</div>
            <div className="flex flex-row justify-start items-center space-x-5">
              <div className="font-bold text-black text-6xl">{usdcBalance.toLocaleString()} USDC</div>
              <div className="flex justify-center items-center size-3 bg-black rounded-full"/>
              <div className="font-bold text-black text-6xl">{ethBalance.toLocaleString()} ETH</div>
              <AddFundsDialog />
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
            <div className="flex flex-col space-y-5 w-[45%]">
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
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
import { userType } from "@/models/users";

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

function HistoryCard({title, subtitle, amount}: {title: string, subtitle: string, amount: number}) {
  return (
    <div className="flex flex-row justify-between h-24 px-5 hover:bg-gray-200 rounded-lg transition-all select-none">
      <div className="flex flex-row space-x-5">
        <div className="flex items-center justify-center">
          <div className="size-16 bg-amber-400 rounded-full"></div>
        </div>
        <div className="flex flex-col space-y-2 justify-center">
          <div className="font-semibold text-2xl">{title}</div>
          <div className="font-base text-xl">{subtitle}</div>
        </div>
      </div>
      <div className="flex flex-col justify-center font-semibold text-2xl">{amount ? amount + ' USDC': ''}</div>
    </div>
  )

}

function InvestmentCard() {

}

function AddFundsDialog({ walletAddress }: { walletAddress: string | undefined }) {

  const { Canvas } = useQRCode()

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
        {
          walletAddress !== undefined ? <Canvas
          text={walletAddress}
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
        /> : "Loading..."
        }
        
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

function NewInvestmentDialog() {

  const [depositAmount, setDepositAmount] = useState(0)

  const duration = 7
  const annualInterest = 14

  const getDepositDuration = () => {
    return (duration)
  }

  const getMaxPossibleInterest = () => {
    return (annualInterest)
  }

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
            New Fixed Deposit
        </motion.div>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl text-black pt-5">New Fixed Deposit</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
            <div className="flex text-black font-semibold text-2xl pl-2">I want to deposit</div>
            <div className="flex flex-row justify-center items-center bg-white w-96 h-16 px-5
            rounded-lg inset-shadow-sm inset-shadow-indigo-200 text-black font-semibold text-2xl">
              <input className="flex w-72 h-16 p-2 focus:outline-0" type="number" onChange={(e) => setDepositAmount(Number(e.target.value))}/>
              <div className="">USDC</div>
            </div>
          </div>
          <hr className="w-[90%] border-2 border-gray-200 mx-10 rounded-full mt-2 mb-10"/>
          <div className="flex flex-col space-y-3 w-[80%] text-xl pb-5">
            <div className="flex text-black font-bold text-3xl">Deposit Details</div>
            <div className="flex flex-row justify-between items-center">
              <div>Amount to deposit:</div>
              <div>{depositAmount} USDC</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div>Deposit Duration:</div>
              <div>{getDepositDuration()} Days</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="w-[75%]">Maximum Obtainable Interest (annual):</div>
              <div>{getMaxPossibleInterest()}%</div>
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
              Deposit
          </motion.div>
      </DialogContent>
    </Dialog>
  )

}

type LoanHistory = {
  "loanAmount": string,
  "collateralAmount": string,
  "startTime": Date,
  "endTime": Date,
  "totalRepaid": string,
  "closedTime": Date
}

function unixToDate(timestamp: number) {
  return (new Date(timestamp * 1000))
}

export default function Dashboard() {

  const [currUserData, setCurrUserData] = useState<userType | null>(null)
  const [userUSDCBal, setUserUSDCBal] = useState<number | null>(null)
  const [userETHBal, setUserETHBal] = useState<number | null>(null)

  const [userLoanHistory, setUserLoanHistory] = useState<LoanHistory[]>([])

  useEffect(() => {

    fetch('/api/me', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setCurrUserData(json))
      }
    })

    fetch('/api/wallet/eth', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setUserETHBal(json.eth))
      }
    })

    fetch('/api/wallet/usdc', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setUserUSDCBal(json.usdc))
      }
    })

    fetch('/api/me/loans', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setUserLoanHistory(json))
      }
    })

  }, [])

  useEffect(() => {
    console.log(JSON.stringify(currUserData))
  }, [currUserData])

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#EFF8FC] items-center">
      <Header userLoggedIn={true}/>
      <div className="flex-grow p-12 w-full">
        <div className="flex flex-col space-y-8 w-full">
          <div className="px-10 mt-16 font-semibold text-black text-5xl">Welcome back, {currUserData?.firstName}!</div>
          <div className="flex flex-col space-y-5 px-10">
            <div className="font-semibold text-black text-4xl">Total Balance</div>
            <div className="flex flex-row justify-start items-center space-x-5">
              <div className="font-bold text-black text-6xl">{userUSDCBal?.toLocaleString()} USDC</div>
              <div className="flex justify-center items-center size-3 bg-black rounded-full"/>
              <div className="font-bold text-black text-6xl">{userETHBal?.toLocaleString()} ETH</div>
              <AddFundsDialog walletAddress={currUserData?.walletAddress} />
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
              {
                userLoanHistory?.map((h, i) => <HistoryCard 
                  key={i}
                  title="Took out a loan"
                  subtitle={h.startTime.toLocaleDateString()}
                  amount={Number(h.loanAmount)}/>)
              }
            </div>
            <div className="w-1 h-auto border-2 border-gray-200 rounded-full mt-16"/>
            <div className="flex flex-col w-[45%] space-y-8">

              <div className="flex flex-row justify-between">
                <div className="text-black text-3xl font-bold">Investments</div>
                <NewInvestmentDialog />
              </div>
              <div className="space-y-5">
                
              </div>


              <div className="text-black text-3xl font-bold">Credit Standing</div>
              <div className="space-y-10">
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
      </div>
      <Footer />

    </div>
  )
}
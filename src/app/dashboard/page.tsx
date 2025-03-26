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
import { motion } from "motion/react";

import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from "react";
import { userType } from "@/models/users";
import NewLoanApplicationDialog from "./NewLoanApplicationDialog";
import NewDepositDialog from "./NewDepositDialog";
import { toast } from "sonner";

type ActiveLoan = {
  loanAmount: string, // in usdc
  collateralAmount: string, // in eth
  startTime: Date,
  endTime: Date,
  active: string,
  liquidated: string,
  interest: string,
  totalDue: string,
}

function LoanInfoCarousel({ activeLoan }: {activeLoan: ActiveLoan | null}) {

  const activeLoans = []

  if (activeLoan !== null)
    activeLoans.push(activeLoan)

  return (
    <>
    {
      activeLoans.length > 0 ? <Carousel
      className="flex justify-center w-[95%]"
      opts={{
        align: 'center',
        loop: true
      }}>
        <CarouselPrevious />
          <CarouselContent>
            {activeLoans.map((loan, index) => (
                <CarouselItem key={index} className="basis-1/4">
                  <LoanInfoCard loan={loan}/>
                </CarouselItem>
            ))}
          </CarouselContent>
        <CarouselNext />
      </Carousel> : <div className="text-black font-semibold text-2xl">You have no active loans.</div>
    }
    </>
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

function AddFundsDialog({ walletAddress, onOpenChange }: { walletAddress: string | undefined, onOpenChange: () => void }) {

  const { Canvas } = useQRCode()

  return(
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <motion.div
          className="flex justify-center w-12 h-12 bg-[#5202DB] rounded-full text-white font-semibold
          text-4xl text-center cursor-pointer select-none"
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

type LoanHistory = {
  "loanAmount": string,
  "collateralAmount": string,
  "startTime": Date,
  "endTime": Date,
  "totalRepaid": string,
  "closedTime": Date
}

export default function Dashboard() {

  const [userData, setUserData] = useState<userType | null>(null)
  const [userUSDCBal, setUserUSDCBal] = useState<number | null>(null)
  const [userETHBal, setUserETHBal] = useState<number | null>(null)
  const [maxLoanableAmount, setMaxLoanableAmount] = useState<number>(0)
  const [userLoanHistory, setUserLoanHistory] = useState<LoanHistory[]>([])
  const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(null)

  useEffect(() => {

    fetch('/api/me', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setUserData(json))
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

    fetch('/api/loan', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          console.log(json)
          setMaxLoanableAmount(json.available)
        })
      }
    })

    fetch('/api/me/loan', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setUserLoanHistory(json))
      }
    })

    fetch('/api/me/loan/active', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setActiveLoan(json))
      }
    })

  }, [])

  useEffect(() => {
    console.log(JSON.stringify(userData))
  }, [userData])

  useEffect(() => {

    const interval = setInterval(() => {
      refreshMetrics()
    }, 30000)

    return () => clearInterval(interval)

  }, [])

  

  const refreshMetrics = () => {
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

    fetch('/api/loan', {
      method: 'GET'
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          console.log(json)
          setMaxLoanableAmount(Math.floor(json.available * 0.8))
        })
      }
    })
  }

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#EFF8FC] items-center">
      <Header userLoggedIn={true}/>
      <div className="flex-grow p-12 w-full">
        <div className="flex flex-col space-y-8 w-full">
          <div className="px-10 mt-16 font-semibold text-black text-5xl">Welcome back, {userData?.firstName}!</div>
          <div className="flex flex-col space-y-5 px-10">
            <div className="font-semibold text-black text-4xl">Total Balance</div>
            <div className="flex flex-row justify-start items-center space-x-5">
              <div className="font-bold text-black text-6xl">{userUSDCBal?.toLocaleString()} USDC</div>
              <div className="flex justify-center items-center size-3 bg-black rounded-full"/>
              <div className="font-bold text-black text-6xl">{userETHBal?.toLocaleString()} ETH</div>
              <AddFundsDialog walletAddress={userData?.walletAddress} onOpenChange={refreshMetrics} />
            </div>
          </div>
          <hr className="border-2 border-gray-200 mx-10 rounded-full mt-2 mb-10"/>
          <div className="flex flex-row justify-between px-10">
            <div className="text-black text-3xl font-bold">Ongoing Loans</div>
            <NewLoanApplicationDialog 
              userData={userData}
              userETHBal={userETHBal}
              maxLoanableAmount={maxLoanableAmount}
              />
          </div>
          <div className="flex justify-center">
            <LoanInfoCarousel activeLoan={activeLoan}/>
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
            <div className="flex flex-col w-[45%] space-y-5">

              <div className="flex flex-row justify-between">
                <div className="text-black text-3xl font-bold">Investments</div>
                <NewDepositDialog userUSDCBal={userUSDCBal}/>
              </div>
              <div className="space-y-5">
                
              </div>

              {/* <div className="text-black text-3xl font-bold">Credit Standing</div>
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
              </div> */}
              
            </div>


          </div>
          
        </div>
      </div>
      <Footer />

    </div>
  )
}
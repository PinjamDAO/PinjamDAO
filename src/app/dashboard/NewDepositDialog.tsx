import { DialogHeader } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { motion } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"

export default function NewDepositDialog({ userUSDCBal }: { userUSDCBal: number | null}) {

  const [depositAmount, setDepositAmount] = useState(0)
  const [depositSuccess, setDepositSuccess] = useState<boolean | null>(null)

  const duration = 30
  const annualInterest = 14

  const getDepositDuration = () => {
    return (duration)
  }

  const getMaxPossibleInterest = () => {
    return (annualInterest)
  }

  const submitFixedDeposit = () => {

    fetch('/api/loan', {
      method: 'POST',
      body: JSON.stringify({
        amount: depositAmount
      })
    }).then((resp) => {
      if (resp.ok) {
        setDepositSuccess(true)
        toast(`Successfully deposited ${depositAmount} USDC into the loan pool.`)
      }
    }).catch((e) => console.error(e))

  }

  // helper

  const getButtonColour = () => {

    if (userUSDCBal === null || userUSDCBal < depositAmount || depositAmount === 0) {
      return ('bg-[#afa3c4]')
    } 

    if (depositSuccess === false) {
      return ('bg-red-400')
    } else if (depositSuccess === true) {
      return ('bg-green-400')
    }

    return ('bg-[#5202DB]')
  }

  const getButtonDisabledBoolean = () => {

    if (userUSDCBal === null || userUSDCBal < depositAmount || depositSuccess !== null  || depositAmount === 0) {
      return (true)
    }
    return (false)
  }

  const getButtonLabel = () => {

    if (userUSDCBal === null || userUSDCBal < depositAmount ) {
      return ('Insufficient Funds in Wallet')
    }

    if (depositAmount === 0)
      return ('Cannot deposit specified amount')

    if (depositSuccess === true) {
      return ('Deposit Success!')
    } else if (depositSuccess === false) {
      return ('Deposit Failed')
    }

    return ('Deposit')
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
            <motion.button
            className={`flex items-center justify-center min-w-48 h-12 px-5 rounded-lg text-white
            font-semibold text-lg cursor-pointer select-none transition-colors ${getButtonColour()}`}
            disabled={getButtonDisabledBoolean()}
            whileHover={!getButtonDisabledBoolean() ? { scale: 1.1 } : {}}
            whileTap={!getButtonDisabledBoolean() ? { scale: 0.9 } : {}}
            onClick={submitFixedDeposit}
            >
              {getButtonLabel()}
          </motion.button>
      </DialogContent>
    </Dialog>
  )

}
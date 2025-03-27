import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"
import { ActiveLoan } from "@/types/type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";


function PayLoanDialog({ userUSDCBal, loan, hovering }: { userUSDCBal: number | null, loan: ActiveLoan, hovering: boolean }) {

  const [repayAmount, setRepayAmount] = useState(Number(loan.loanAmount))
  const [repaySuccess, setRepaySuccess] = useState<boolean | null>(null)

  const [maxToRepay] = useState(Number(Number(loan.loanAmount).toFixed(2)))

  const repayLoan = () => {

    fetch('/api/loan/pay', {
      method: 'POST',
      body: JSON.stringify({
        amount: repayAmount.toFixed(6),
      })
    }).then((resp) => {
      if (resp.ok) {
        setRepaySuccess(true)
        toast(`Successfuly scheduled ${repayAmount.toFixed(2)} USDC for loan repayment.`)
      } else if (resp.status === 409) {
        setRepaySuccess(false)
        toast.error('Loan repayment is already in progress, please wait for completion')
      }
    })
  }

  const reset = () => {
    setRepayAmount(Number(loan.loanAmount))
    setRepaySuccess(null)
  }

  const getButtonColour = () => {

    if (userUSDCBal === null || userUSDCBal < repayAmount || repayAmount === 0 || repayAmount > maxToRepay) {
      return ('bg-[#afa3c4]')
    } 

    if (repaySuccess === false) {
      return ('bg-red-400')
    } else if (repaySuccess === true) {
      return ('bg-green-400')
    }

    return ('bg-[#5202DB]')
  }

  const getButtonDisabledBoolean = () => {

    if (userUSDCBal === null || userUSDCBal < repayAmount || repaySuccess !== null  || repayAmount === 0 || repayAmount > maxToRepay) {
      return (true)
    }
    return (false)
  }

  const getButtonLabel = () => {

    if (userUSDCBal === null || userUSDCBal < repayAmount ) {
      return ('Insufficient Funds in Wallet')
    }

    if (repayAmount === 0)
      return ('Cannot repay specified amount')

    if (repayAmount > maxToRepay)
      return ('Cannot over repay loan')

    if (repaySuccess === true) {
      return ('Loan Repayment Scheduled')
    } else if (repaySuccess === false) {
      return ('Loan Repayment Failed')
    }

    return (`Repay ${repayAmount} USDC`)
  }

  return(
    <Dialog>
      <DialogTrigger>
      <AnimatePresence mode="wait">
        {
          hovering && <motion.div
          className="group flex w-14 h-10 p-4 bg-white text-black rounded-lg items-center
          justify-center text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          >
            Pay
          </motion.div>
        }
      </AnimatePresence>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl text-black pt-5">Repay loan</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <div className="flex text-black font-semibold text-2xl pl-2">I want to repay</div>
          <div className="flex flex-row justify-center items-center bg-white w-96 h-16 px-5
          rounded-lg inset-shadow-sm inset-shadow-indigo-200 text-black font-semibold text-2xl">
            <input className="flex w-72 h-16 p-2 focus:outline-0" type="number" onChange={(e) => setRepayAmount(Number(e.target.value))} value={repayAmount !== 0 ? repayAmount : ''}/>
            <div className="">USDC</div>
          </div>
        </div>
        <hr className="w-[90%] border-2 border-gray-200 mx-10 rounded-full mt-2 "/>
        <div className="flex flex-col space-y-3 w-[80%] text-center">
          If the full amount has been paid, the collateral will be released back to your account.
        </div>
        <motion.button
        className={`flex items-center justify-center min-w-48 h-12 bg-[#5202DB] rounded-lg text-white
        font-semibold text-lg cursor-pointer select-none px-5 transition-colors
        ${getButtonColour()}`}
        disabled={getButtonDisabledBoolean()}
        whileHover={!getButtonDisabledBoolean() ? { scale: 1.1 } : {}}
        whileTap={!getButtonDisabledBoolean() ? { scale: 0.9 } : {}}
        onClick={repayLoan}
        >
          {getButtonLabel()}
        </motion.button>
      </DialogContent>
    </Dialog>
  )

}

export default function LoanInfoCard({ userUSDCBal, loan }: { userUSDCBal: number | null, loan: ActiveLoan }) {

  const loanName = "Loan"
  const [hovering, setHovering] = useState(false)

  const getDueDate = (date: Date) => {

    const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const weeksUntil = Math.ceil(daysUntil / 7)

    if (daysUntil > 0 && daysUntil <= 7)
      return (daysUntil + ' day' + (daysUntil > 1 ? 's' : ''))
    else if (daysUntil > 7 && daysUntil <= 31)
      return (weeksUntil + ' week' + (weeksUntil > 1 ? 's' : ''))

    return (date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' }))
  }

  return (
    <motion.div
      className="flex flex-col w-88 h-48 rounded-lg bg-purple-300
      hover:bg-[#9747FF] hover:text-white transition-all p-5 space-y-1 group relative cursor-pointer select-none"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      <div className="text-5xl font-bold -ml-1">
        {Number(loan.loanAmount).toFixed(2)} USDC
      </div>
      <div className="text-3xl font-semibold ">{loanName}</div>
      <div className="text-2xl font-semibold">{Number(loan.totalDue).toFixed(2)}$ due in {getDueDate(new Date(loan.endTime))}</div>
      <div className="absolute bottom-5 right-5">
        <PayLoanDialog loan={loan} hovering={hovering} userUSDCBal={userUSDCBal}/>
      </div>
    </motion.div>
  )
}
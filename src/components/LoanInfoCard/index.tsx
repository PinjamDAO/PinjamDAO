import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"

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

export default function LoanInfoCard({ loan }: { loan: ActiveLoan }) {

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

  const payLoan = () => {

    fetch('/api/loan/pay', {
      method: 'POST',
      body: JSON.stringify({
        amount: 10,
        addr: ''
      })
    }).then((resp) => {
      if (resp.ok) {
        toast(`Repaid ${loan.totalDue} USDC.`)
      }
    })

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
        <AnimatePresence mode="wait">
          {
            hovering &&
            <motion.div
            className="group flex w-14 h-10 p-4 bg-white text-black rounded-lg items-center
            justify-center text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{
              scale: 1.1
            }}
            whileTap={{
              scale: 0.9
            }}
            onClick={payLoan}
            >
              Pay
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
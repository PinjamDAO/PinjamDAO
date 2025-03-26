
import { userType } from "@/models/users"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { AnimatePresence, motion } from "motion/react"
import { useState, useEffect } from "react"
import Dropdown from "@/components/Dropdown"
import { toast } from "sonner"

export default function NewLoanApplicationDialog(
  { userData,
    userETHBal, 
    maxLoanableAmount,
  }: { 
    userData: userType | null, 
    userETHBal: number | null, 
    maxLoanableAmount: number,
  }
) {

  const annualInterest = 15
  const repaymentDurationMonths = 6
  const [open, setOpen] = useState(false)
  const [borrowAmount, setBorrowAmount] = useState(0)
  const [collateralAmountETH, setCollateralAmountETH] = useState(0)
  const [ETHToUSDPrice, setETHToUSDPrice] = useState(0)
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [applicationStatus, setApplicationStatus] = useState<boolean | null>(null)
  const [userPublicAddress, setUserPublicAddress] = useState('')
  const [loanSuccess, setLoanSuccess] = useState<boolean | null>(false)

  const loanPurposes = [
    'Property',
    'Automobile',
    'Education',
    'Debt Consolidation',
    'Medical',
    'Personal',
    'Other'
  ]

  useEffect(() => {

    fetch('https://hermes.pyth.network/api/latest_price_feeds?ids[]=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', {
      method: 'GET',
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setETHToUSDPrice(json[0].price.price * Math.pow(10, json[0].price.expo)))
      }
    })

  }, [])

  // useeffect

  useEffect(() => {

    if (ETHToUSDPrice !== 0) {
      setCollateralAmountETH(borrowAmount / ETHToUSDPrice)
    } else {
      setCollateralAmountETH(0)
    }
  }, [borrowAmount])

  // button triggered

  const reset = () => {
    setBorrowAmount(0)
    setCollateralAmountETH(0)
    setSelectedPurpose('')
    setApplicationStatus(null)
  }

  const onApplyLoan = () => {

    if (!userData)
      return

    const body = {
      Age: (new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear()),
      BaseInterestRate: annualInterest,
      EducationLevel: userData.educationLevel,
      EmploymentStatus: userData.employmentStatus,
      InstallmentDuration: repaymentDurationMonths,
      InterestRate: annualInterest,
      LoanAmount: borrowAmount,
      LoanCurrency: 'usdc',
      LoanDuration: repaymentDurationMonths,
      LoanPurpose: selectedPurpose,
      LoanStartDate: new Date(),
      TotalLoanCollatoralAmount: borrowAmount // USDC, not ETH
    }

    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => setApplicationStatus(Boolean(json.result)))
      }
    }).catch((e) => console.log(e))

  }

  useEffect(() => {
    console.log(userPublicAddress)
  }, [userPublicAddress])

  const confirmLoan = () => {

    // always returns 200
    fetch('/api/loan/take', {
      method: 'POST',
      body: JSON.stringify({
        amount: collateralAmountETH.toFixed(18),
        addr: userPublicAddress
      })
    }).then((resp) =>{
      if (resp.ok) {
        setOpen(false)
        toast(`Loan fund of ${borrowAmount} USDC have been scheduled to be transfered in ~10 minutes.`)
      }
    })
  }

  // helpers 
  const getAnnualInterest = () => {
    return (annualInterest)
  }

  const getRepaymentDurationMonths = () => {
    return (repaymentDurationMonths)
  }

  const getButtonColour = () => {

    if (userETHBal === null || 
      collateralAmountETH + 0.000000000000000001 > userETHBal ||
      selectedPurpose === '' ||
      borrowAmount === 0 ||
      borrowAmount > maxLoanableAmount
    ) {
      return ('bg-[#afa3c4]')
    } 

    if (applicationStatus === false) {
      return ('bg-red-400')
    } else if (applicationStatus === true) {
      return ('bg-green-400')
    }

    return ('bg-[#5202DB]')
  }

  const getButtonDisabledBoolean = () => {

    if (userETHBal === null || 
      collateralAmountETH + 0.000000000000000001 > userETHBal || 
      applicationStatus !== null ||
      selectedPurpose === '' ||
      borrowAmount === 0 ||
      borrowAmount > maxLoanableAmount
    ) {
      return (true)
    }
    return (false)
  }

  const getButtonLabel = () => {

    if (userETHBal === null || collateralAmountETH + 0.000000000000000001 > userETHBal) {
      return ('Insufficient Collateral in Wallet')
    }

    if (applicationStatus === false) {
      return ('Loan Application Rejected')
    } else if (applicationStatus === true) {
      return ('Loan Application Accepted')
    }

    if (selectedPurpose === '') {
      return ('Purpose not selected')
    }

    if (borrowAmount === 0 || borrowAmount > maxLoanableAmount) {
      return ('Cannot borrow specified amount')
    }

    return ('Apply')
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
          onClick={reset}
          >
            New Loan
        </motion.div>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <AnimatePresence mode='wait'>
        {
          applicationStatus === null ? (
            <>
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
              <div className="flex flex-col space-y-3">
                <div className="flex text-black font-semibold text-2xl pl-2">For the purpose of</div>
                <Dropdown options={loanPurposes} label={'Purpose'} selected={selectedPurpose} setSelected={setSelectedPurpose}/>
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
                  <div>{collateralAmountETH.toFixed(6)} ETH</div>
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
              <hr className="w-[90%] border-2 border-gray-200 mx-10 rounded-full mt-2 "/>
              <div className="flex flex-col space-y-3 w-[80%] text-center">
                Disclaimer: This loan application will be processed by artificial intelligence.
              </div>
              <motion.button
              className={`flex items-center justify-center min-w-48 h-12 bg-[#5202DB] rounded-lg text-white
              font-semibold text-lg cursor-pointer select-none px-5 transition-colors
              ${getButtonColour()}`}
              disabled={getButtonDisabledBoolean()}
              whileHover={!getButtonDisabledBoolean() ? { scale: 1.1 } : {}}
              whileTap={!getButtonDisabledBoolean() ? { scale: 0.9 } : {}}
              onClick={onApplyLoan}
              >
                {getButtonLabel()}
              </motion.button>
            </>
          ) : (
          <>
            {
              applicationStatus === true ? (
              <>
                <DialogHeader>
                  <DialogTitle className="font-bold text-4xl text-black pt-5">Loan Approved</DialogTitle>
                </DialogHeader>
                <div className="text-xl w-[80%]">To take the loan, input the destination wallet address and press confirm.</div>
                <div className="flex flex-col space-y-3">
                  <div className="flex text-black font-semibold text-2xl pl-2">My wallet's public address is</div>
                  <input className="bg-white text-black font-medium text-md w-100 h-16 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200 focus:outline-0"
                    onChange={(e) => setUserPublicAddress(e.target.value)} />
                </div>
                <hr className="w-[90%] border-2 border-gray-200 mx-10 rounded-full mt-2 "/>
                
                <motion.button
                className={`flex items-center justify-center min-w-48 h-12 bg-[#5202DB] rounded-lg text-white
                font-semibold text-lg cursor-pointer select-none px-5 transition-colors
                ${userPublicAddress.length !== 0 ? 'bg-[#5202DB]' : 'bg-[#afa3c4]' }`}
                disabled={userPublicAddress.length === 0}
                whileHover={userPublicAddress.length !== 0 ? { scale: 1.1 } : {}}
                whileTap={userPublicAddress.length !== 0 ? { scale: 0.9 } : {}}
                onClick={confirmLoan}
                >
                  {userPublicAddress.length === 0 ? 'Enter a valid wallet address' : 'Confirm'}
                </motion.button>
              </>
              ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="font-bold text-4xl text-black pt-5">Loan Denied</DialogTitle>
                </DialogHeader>
              </>
              )
            }
          </>
          )
        }
        </AnimatePresence>
        
      </DialogContent>
    </Dialog>
  )

}
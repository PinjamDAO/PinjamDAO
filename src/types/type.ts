export type Currency = "usdc" | "eth"
export type Frequency = "day" | "month" | "annual"
export type InterestType = "simple" | "compound"

export type Interest = {
  type: InterestType
  rate: number
  frequency: Frequency
  penaltyRate: number
  penaltyFrequency: Frequency
}

export type Collateral = {
  assetAmount: number
  assetCurrency: Currency
}


export type RepaymentSchedule = {
  startDate: Date;
  endDate: Date;
  installments: number;
  installmentAmount: number;
  installmentCurrency: Currency;
}


export type Loan = {
  loanAmount: number
  loanCurrency: Currency
  loanInterest: Interest
  loanCollateral: Collateral[]
  borrowerID: string
  loanStartDate: Date
  loanExpectedEndDate: Date
  repaymentSchedule: RepaymentSchedule
  createdAt: Date
}
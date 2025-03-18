import { SessionOptions } from "iron-session"

export type Currency = "usdc" | "eth"
export type Frequency = "day" | "month" | "annual"
export type InterestType = "simple" | "compound"

export type WorldIDResponse = {
  proof: String,
  merkle_root: String,
  nullifier_hash: String,
  verification_level: String
}

export type SessionData = {
  id: String
  log_in: Boolean
}

// TODO: this does not belong here
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: process.env.SESSION_NAME!,
  cookieOptions: {
    // secure only works in `https` environments
    secure: process.env.NODE_ENV === "production",
  },
};

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

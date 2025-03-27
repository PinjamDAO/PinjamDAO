import { SessionOptions } from "iron-session"

export type Currency = "usdc" | "eth"
export type Frequency = "day" | "month" | "annual"
export type InterestType = "simple" | "compound"

export type WorldIDResponse = {
  proof: string,
  merkle_root: string,
  nullifier_hash: string,
  verification_level: string
}

export type SessionData = {
  id: string
  log_in: boolean
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

export type LoanDetails = {
    loanAmount: number,
    collateralAmount: number,
    startTime: number,
    endTime: number,
    active: boolean,
    liquidated: boolean,
    interest: number,
    totalDue: number
}

export type ActiveLoan = {
	loanAmount: string, // in usdc
	collateralAmount: string, // in eth
	startTime: Date,
	endTime: Date,
	active: string,
	liquidated: string,
	interest: string,
	totalDue: string,
  }
  
export type LoanHistory = {
	"loanAmount": string,
	"collateralAmount": string,
	"startTime": Date,
	"endTime": Date,
	"totalRepaid": string,
	"closedTime": Date
}
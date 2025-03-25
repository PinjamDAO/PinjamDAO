'use client'

var QRCode = require('qrcode')
import { LoanDetails } from "@/types/type"
import { useEffect, useState } from "react"

function ApplyForLoan() {
    const [ walletCode, setWalletCode ] = useState("")
    const [ moneyCount, setMoneyCount ] = useState(0)
    const [ recvAddr, setrecvAddr ] = useState("")

    const refreshETH = () => {
        fetch('/api/wallet/eth', {
            method: 'GET'
        }).then((val) => val.json())
        .then(res => setMoneyCount(res.eth))
    }

    useEffect(() => {
        const canvas = document.getElementById('walletQR')!

        fetch('/api/me', {
            method: 'GET',
        }).then((val) => val.json())
        .then((res) =>{ 
            QRCode.toCanvas(canvas, res.walletAddress)
            setWalletCode(res.walletAddress)
        })

        refreshETH()
    }, [])

    useEffect(() => {
        console.log(recvAddr)
    }, [recvAddr])

    return (
        <div>
            <div>Make sure you sent money before doing below, or it will fail lol</div>
            <div>Send to this address: {walletCode}</div>
            <div>Cool qrcode of your wallet</div>
            <canvas id="walletQR"></canvas>
            <button onClick={async () => {
                fetch('/api/loan/take', {
                    method: 'POST',
                    body: JSON.stringify({
                        addr: recvAddr
                    })
                }).then((rez) => {
                    console.log(rez)
                }).catch((err) => {
                    console.log(err)
                })
                // disable the button here im too lazy
            }}>
                Apply a loan
            </button>
            <div>Wallet Stats for Nerds</div>
            <div>{moneyCount.toFixed(18)} ETH</div>
            <button onClick={async () => {
                refreshETH()
            }}>Refresh money count</button>
            <div>Heads up, ALL of these will be transfered to be loaned, hehehaw</div>
            <div>Also, put your destination addr here</div>
            <input className="bg-black text-white" onChange={
                (val) => {
                    setrecvAddr(val.target.value)
                }
            }>
            </input>
        </div>
    )
}

function DisplayLoanDetails (props: any) {
    const [ walletCode, setWalletCode ] = useState("")
    const [ moneyCount, setMoneyCount ] = useState(0)

    const refreshUSDC = () => {
        fetch('/api/wallet/usdc', {
            method: 'GET'
        }).then((val) => val.json())
        .then(res => setMoneyCount(res.usdc))
    }

    useEffect(() => {
        const canvas = document.getElementById('walletQR')!

        fetch('/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },        
        }).then((val) => val.json())
        .then((res) =>{ 
            QRCode.toCanvas(canvas, res.walletAddress)
            setWalletCode(res.walletAddress)
        })

        refreshUSDC()
    }, [])

    const loan = props.loan
    return (
        <div>
            <div>Make sure you sent money before doing below, or it will fail lol</div>
            <div>Send to this address: {walletCode}</div>
            <div>Cool qrcode of your wallet</div>
            <canvas id="walletQR"></canvas>
            <br></br>
            <div>Loan Amount: {loan.loanAmount} USDC</div>
            <div>Collateral Amount: {loan.collateralAmount} ETH</div>
            <div>Interest: {loan.interest} USDC</div>
            <div>Total Due: {loan.totalDue} USDC</div>
            <br></br>
            <div>Make sure wallet have money</div>
            <button onClick={async () => {
                    fetch('/api/loan/pay', {
                        method: 'POST'
                    }).then((rez) => {
                        console.log(rez)
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            } className="bg-black text-white">Repay your loan</button>
            <div>Wallet Stats for Nerds</div>
            <div>{moneyCount.toFixed(6)} USDC</div>
            <button onClick={async () => {
                refreshUSDC()
            }}>Refresh money count</button>

        </div>
    )
}

export default function Loan() {
    const [ loanData, setLoanData ] = useState({
        loanAmount: 0,
        collateralAmount: 0,
        startTime: 0,
        endTime: 0,
        active: false,
        liquidated: false,
        interest: 0,
        totalDue: 0
    })

    useEffect(() => {
        fetch('/api/me/loan/active', {
            method: 'GET'
        })
        .then((data) => data.json())
        .then((loan: LoanDetails) => {
                setLoanData(loan)
                console.log(loan)
            }
        )
    }, [])

    return <div>
        {
            loanData.active ? 
            <DisplayLoanDetails loan={loanData} /> : <ApplyForLoan />
        }
    </div>
}
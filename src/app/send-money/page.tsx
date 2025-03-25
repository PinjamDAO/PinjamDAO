'use client'

var QRCode = require('qrcode')
import { useEffect, useState } from "react"


export default function SendMoney() {
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
        }).then((val) => val.json())
        .then((res) =>{ 
            QRCode.toCanvas(canvas, res.walletAddress)
            setWalletCode(res.walletAddress)
        })

        refreshUSDC()
    }, [])


    return <div>
            <div>Make sure you sent money before doing below, or it will fail lol</div>
            <div>Send to this address: {walletCode}</div>
            <div>Cool qrcode of your wallet</div>
            <canvas id="walletQR"></canvas>
            <button onClick={async () => {
                fetch('/api/loan', {
                    method: 'POST'
                }).then((rez) => {
                    console.log(rez)
                }).catch((err) => {
                    console.log(err)
                })
                // disable the button here im too lazy
            }}>
                Send money for loaning
            </button>
            <div>Wallet Stats for Nerds</div>
            <div>{moneyCount.toFixed(6)} USDC</div>
            <button onClick={async () => {
                refreshUSDC()
            }}>Refresh money count</button>
            <div>Heads up, ALL of these will be transfered into our big loan wallet, hehehaw</div>
    </div>
}
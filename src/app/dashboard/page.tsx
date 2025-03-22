'use client'

var QRCode = require('qrcode')
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
    async function signOut () {
        await fetch('/api/session', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },        
        })
        redirect('/')
    }

    useEffect(() => {
        const canvas = document.getElementById('walletQR')!
        const span = document.getElementById('walletAddr')!

        fetch('/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },        
        }).then((val) => val.json())
        .then((res) =>{ 
            QRCode.toCanvas(canvas, res.walletAddress)
            span.innerText = res.walletAddress
        })

    })

    return (
        <>
            <div>Woahh look at this cool dashhboard woahhhhhhh pizza</div>
            <button className="bg-white text-black" onClick={signOut}>
                Sign Out
            </button>
            <div>uhh your wallet address qr</div>
            <canvas id="walletQR"></canvas>
            <div>Wallet Addr: <span id="walletAddr"></span></div>
        </>
    )
}
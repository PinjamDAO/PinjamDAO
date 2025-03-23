'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const [ eth, setETH ] = useState(0)
    const [ val, setVal ] = useState(0)
    const [ addr, setaddr ] = useState("")
    const route = useRouter()

    useEffect(() => {
        fetch('/api/wallet/eth')
        .then((data) => data.json())
        .then((stuff) => {
            setETH(stuff.eth)
        })
    }, [])

    async function signOut () {
        await fetch('/api/session', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },        
        })
        route.push('/')
    }

    return (
        <>
            <div>Woahh look at this cool dashhboard woahhhhhhh pizza</div>
            <button className="bg-white text-black" onClick={signOut}>
                Sign Out
            </button>
            <br></br>
            <button onClick={() => {
                route.push('/loan')
            }} className="bg-white text-black">
                Loaning
            </button>
            <br></br>
            <button onClick={() => {
                route.push('/send-money')
            }} className="bg-white text-black">
                Mr beast
            </button>
            <br></br>
            <br></br>
            <div>Wallet Amount RN: {eth.toFixed(18)} ETH</div>
            <div>Withdraw X Amount From Circle Wallet</div>
            <div>Withdraw Amount:</div>
            <input onChange={(stuff) => setVal(Number(stuff.target.value))} className="bg-white text-black">
            </input>
            <div>Destination Addr: </div>
            <input onChange={(stuff) => setaddr(stuff.target.value)} className="bg-white text-black">
            </input>
            <br></br>
            <button onClick={() => {
                fetch('/api/wallet/eth/withdraw', {
                    method: 'POST',
                    body: JSON.stringify({
                        addr: addr,
                        amount: val
                    })
                })
            }}>Withdraw from Circle</button>
        </>
    )
}
'use client'

import { useRouter } from "next/navigation"

export default function Dashboard() {
    const route = useRouter()

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
        </>
    )
}
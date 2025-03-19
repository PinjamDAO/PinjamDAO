'use client'

import { redirect } from "next/navigation"

export default function Dashboard() {
    async function signOut () {
        await fetch('/api/session', {
            method: 'DESTROY',
            headers: {
                'Content-Type': 'application/json',
            },        
        })
        redirect('/')
    }

    return (
        <>
            <div>Woahh look at this cool dashhboard woahhhhhhh pizza</div>
            <button className="bg-white text-black" onClick={signOut}>
                Sign Out
            </button>
        </>
    )
}
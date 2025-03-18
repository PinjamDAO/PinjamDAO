"use client"

import { redirect } from "next/navigation";

export default function SignUp() {
    const submitSignUp = async (formdata: FormData) => {
        const object = {
            username: formdata.get('username')
        }

        // halleluyah
        const response = await fetch('/api/sign-up', {
            method: 'POST',
            body: JSON.stringify(object)
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error)
        } else
            redirect('/dashboard')
    }  

    return (
        <div>
            <form action={submitSignUp}>
                <div>Username</div>
                <input className="bg-white text-black" name="username"></input>
                <button className="bg-grey text-red" type="submit">Submit</button>
            </form>
        </div>
    )
}
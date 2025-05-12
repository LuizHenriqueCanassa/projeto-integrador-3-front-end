"use client"
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function Page() {
    const {data: session, status} = useSession();

    if (status === "unauthenticated") {
        redirect("/account/login");
    }

    console.log(session);

    return (
        <div>
            <h1>Ola, {session?.user?.fullName}</h1>
        </div>
    )
}
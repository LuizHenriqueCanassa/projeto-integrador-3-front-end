"use client"
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

const Page = () => {
    const {data: session, status} = useSession();

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (
        status === "authenticated" &&
         (!session?.user.role.includes("Root")
            && !session?.user.role.includes("Admin")
            && !session?.user.role.includes("Employee")
        )
    ) {
        redirect("/erro/403")
    }

    return (
        <div>
            <h1>Ola, {session?.user?.fullName}</h1>
        </div>
    )
}

export default Page;
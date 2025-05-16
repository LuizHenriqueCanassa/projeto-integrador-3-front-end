"use client"

import Link from "next/link";
import {Button} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";

const Page = () => {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [loans, setLoans] = useState<any[]>([]);

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setLoans(await response.json().then(res => res.data)),
        )
    }, [])

    return (
        <section className={"container mx-auto mt-10"}>
            <div className={"flex justify-between"}>
                <h1 className={"text-4xl"}>Alugueis</h1>
            </div>
        </section>
    )
}

export default Page;
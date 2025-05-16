"use client"

import React, {FormEvent, use, useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {redirect} from "next/navigation";
import {useCookies} from "next-client-cookies";
import {Button, Select, TextInput} from "flowbite-react";

const Page = ({params}: {params : Promise<{id: number}>}) => {
    const {id} = use(params);
    const [loan, setLoan] = useState({
        id: 0,
        status: "",
    });
    const cookies = useCookies();

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans/${id}`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    let {status} = await response.json();
                    setLoan({
                        status: status,
                        id: id
                    });
                }
            },
        )
    }, [])

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans/${id}/status?loanStatus=${form.get("status")}`, cookies.get("accessToken"), {
            method: "PUT"
        }).then(
            async (response) => {
                if(response.status === 204) {
                    redirect("/dashboard/loans")
                }
            },
        )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Atualizar status do Aluguel</h1>
            <form onSubmit={onSubmit} className={"mt-10"}>
                <TextInput value={loan.id} type={"hidden"}/>
                <Select name={"status"}>
                    <option value={"ALUGUEL_VIGENTE"}>Aluguel Vigente</option>
                    <option value={"DEVOLVIDO"}>Devolvido</option>
                </Select>
                <Button className={"mt-10"} type={"submit"} color={"yellow"}>Editar</Button>
            </form>
        </section>
    )
}

export default Page;
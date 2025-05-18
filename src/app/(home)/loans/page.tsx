"use client"

import {redirect} from "next/navigation";
import {useCookies} from "next-client-cookies";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import Link from "next/link";
import {useSession} from "next-auth/react";

const Page = () => {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [loans, setLoans] = useState<any[]>([]);

    if (status === "unauthenticated") {
        redirect("/account/login");
    }

    useEffect(() => {
        console.log("userId: " + session?.user.id);
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans/user/${session?.user.id}`,
            cookies.get("accessToken"),
            {
                method: "GET",
            }
        ).then(
            async (response) => {
                if (response.status === 200) {
                    setLoans(await response.json())
                }
            }
        );
    }, [status]);

    const formatStatus = (status: string) => {
        switch (status) {
            case "WAITING_WITHDRAWN":
                return "Aguardando Retirada";
            case "CURRENT_RENT":
                return "Aluguel Vigente";
            case "RETURN_LATE":
                return "Devolução em atraso";
            case "RETURNED":
                return "Devolvido";
            case "CANCELLED":
                return "Cancelado";
            default:
                return status;
        }
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Meus Alugueis</h1>
            <div className={"overflow-x-auto mt-10"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Id</TableHeadCell>
                            <TableHeadCell>Livro</TableHeadCell>
                            <TableHeadCell>Usuário</TableHeadCell>
                            <TableHeadCell>Data de Locação</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Devolvido em</TableHeadCell>
                            <TableHeadCell>Devolução em atraso</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.id}>
                                <TableCell className={"p-4"}>{loan.id}</TableCell>
                                <TableCell className={"p-4"}>{loan.book.title}</TableCell>
                                <TableCell className={"p-4"}>{loan.user.fullName}</TableCell>
                                <TableCell className={"p-4"}>{loan.loanDate}</TableCell>
                                <TableCell className={"p-4"}>{formatStatus(loan.status)}</TableCell>
                                <TableCell className={"p-4"}>{loan.dateReturned}</TableCell>
                                <TableCell>{loan.isReturnLate ? "Sim" : "Não"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default Page;
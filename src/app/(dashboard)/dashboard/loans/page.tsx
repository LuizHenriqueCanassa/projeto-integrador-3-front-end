"use client"

import Link from "next/link";
import {Alert, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import LoanStatusModal from "@/app/components/loanStatusModal";
import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";

const Page = () => {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [loans, setLoans] = useState<any[]>([]);
    const [hasDeleted, setHasDeleted] = useState<boolean>(false);

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setLoans(await response.json().then(res => res.data)),
        )
    }, [hasDeleted])

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Loan", "ReadAll")) {
            redirect("/erro/403")
        }
    }

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

    const cancelLoan = (id: number) => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans/${id}/cancel`, cookies.get("accessToken"), {
            method: "PUT",
        }).then(
            async (response) => {
                if (response.status === 204) {
                    setHasDeleted(true);
                }
            }
        )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <div className={"flex justify-between"}>
                <h1 className={"text-4xl"}>Alugueis</h1>
            </div>
            {hasDeleted && (
                <Alert color="success" onDismiss={() => setHasDeleted(!hasDeleted)} className={"mt-5"}>
                    <span className="font-medium">Sucesso!</span> Aluguel cancelado com sucesso
                </Alert>
            )}
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
                            <TableHeadCell></TableHeadCell>
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
                                <TableCell className={"w-80"}>
                                    <div className={"inline-flex rounded-md shadow-xs"} role="group">
                                        <Link href={`/dashboard/loans/edit/${loan.id}`}>
                                            <Button color={"yellow"} className={"mr-3 cursor-pointer"}>
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button onClick={() => cancelLoan(loan.id)} color={"red"} className={"cursor-pointer"}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default Page;
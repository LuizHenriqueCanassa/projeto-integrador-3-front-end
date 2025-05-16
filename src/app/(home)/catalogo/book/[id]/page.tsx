"use client"

import React, {use, useEffect, useState} from "react";
import {
    Badge,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody, TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {fetchClient} from "@/app/libs/fetchClient";
import {redirect} from "next/navigation";

const Page = ({params} : { params: Promise<{ id: number }> }) => {
    const {id} = use(params);
    const cookies = useCookies();
    const {data: session, status} = useSession();
    const [book, setBook] = useState({
        id: 0,
        title: "",
        genre: "",
        imageUrl: "https://placehold.co/600x400",
        description: "",
        status: "",
    });
    const [loanModalIsActive, setLoanModalIsActive] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`).then(
            async (response) => response.status === 200 && setBook(await response.json())
        )
    }, [])

    const submitLoanModal = () => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/loans/request?bookId=${book.id}&userId=${session?.user.id}`, cookies.get("accessToken"), {
            method: "POST"
        })
            .then(async (response) => {
                 if (response.status === 204) {
                     redirect("/")
                 }
            });
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Detalhes do Livro</h1>
            <div className={'grid grid-cols-12 gap-x-4 mt-5'}>
                <div className={"col-span-3"}>
                    <img src={book.imageUrl} alt=""/>
                </div>
                <div className={"col-span-9"}>
                    <h1 className={"text-2xl"}>{book.title}</h1>
                    <p>{book.genre}</p>
                    <div className={"mt-10"}>
                        <p>{book.description}</p>
                    </div>
                    <div className={"w-20 mt-5 text-center"}>
                        {book.status === "Alugado"
                            ? <Badge color={"failure"}>{book.status}</Badge>
                            : <Badge color={"success"}>{book.status}</Badge>
                        }
                    </div>
                    <div className={"mt-10"}>
                        {book.status !== "Alugado" && status !== "unauthenticated"  ?
                            <Button onClick={()=>setLoanModalIsActive(true)}>
                                Alugar
                            </Button>
                        : <div></div>}
                    </div>
                </div>
            </div>
            <Modal dismissible show={loanModalIsActive} onClose={() => setLoanModalIsActive(false)}>
                <ModalHeader>Solicitar locação</ModalHeader>
                <ModalBody>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Livro</TableHeadCell>
                                <TableHeadCell>Usuário</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{session?.user.fullName}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="flex flex-wrap gap-2 mt-5">
                        <Button onClick={submitLoanModal} color={"green"}>Confirmar</Button>
                        <Button onClick={()=>setLoanModalIsActive(false)} color="red">Cancelar</Button>
                    </div>
                </ModalBody>
            </Modal>
        </section>
    )
}

export default Page;
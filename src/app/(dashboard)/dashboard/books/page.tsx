"use client"

import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import hasPermission from "@/app/(dashboard)/hasPermission";
import "../../../globals.css";
import hasRole from "@/app/hasRole";
import {Alert, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {useCookies} from "next-client-cookies";
import Link from "next/link";

export default function Page() {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [books, setBooks] = useState<any[]>([]);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [hasDeleted, setHasDeleted] = useState(false);

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setBooks(await response.json()),
        )
    }, [hasDeleted])

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Book", "Read")) {
            redirect("/erro/403")
        }
    }

    const deleteBook = async (id: number) => {
        if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
            if (!hasPermission(session?.user.claims, "Book", "Delete")) {
                redirect("/erro/403")
            }
        }
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`, cookies.get("accessToken"), {
            method: "DELETE",
        }).then(
            async (response) => {
                if (response.status === 204) {
                    setHasDeleted(true);
                }

                if (response.status === 404) {
                    setHasError(true);
                    setErrorMsg("Livro não encontrado")
                }

                if (response.status === 400) {
                    setHasError(true);
                    setErrorMsg("O livro não pode ser deletado pois esta vinculado a um aluguel");
                }
            }
        )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <div className={"flex justify-between"}>
                <h1 className={"text-4xl"}>Livros</h1>
                <Link href={"/dashboard/books/create"}>
                    <Button color={"green"} className={"cursor-pointer"}>Cadastrar</Button>
                </Link>
            </div>
            {hasError && (
                <Alert color="failure" onDismiss={() => setHasError(!hasError)} className={"mt-5"}>
                    <span className="font-medium">Erro!</span> {errorMsg}
                </Alert>
            )}
            {hasDeleted && (
                <Alert color="success" onDismiss={() => setHasDeleted(!hasDeleted)} className={"mt-5"}>
                    <span className="font-medium">Sucesso!</span> Livro deletado com sucesso
                </Alert>
            )}
            <div className={"overflow-x-auto mt-10"}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableHeadCell>Id</TableHeadCell>
                        <TableHeadCell>Titulo</TableHeadCell>
                        <TableHeadCell>Genero</TableHeadCell>
                        <TableHeadCell>ISBN</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell></TableHeadCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                                <TableCell>{book.status}</TableCell>
                                <TableCell className={"w-80"}>
                                    <div className={"inline-flex rounded-md shadow-xs"} role="group">
                                        <Link href={`/dashboard/books/details/${book.id}`} >
                                            <Button className={"mr-3 cursor-pointer"}>Detalhes</Button>
                                        </Link>
                                        <Link href={`/dashboard/books/edit/${book.id}`}>
                                            <Button color={"yellow"} className={"mr-3 cursor-pointer"}>
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button color={"red"} className={"cursor-pointer"} onClick={() => deleteBook(book.id)}>
                                            Excluir
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
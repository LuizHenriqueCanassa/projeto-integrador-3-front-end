"use client"

import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import hasPermission from "@/app/(dashboard)/hasPermission";
import "../../../globals.css";
import hasRole from "@/app/hasRole";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {useCookies} from "next-client-cookies";

export default function Page() {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setBooks(await response.json()),
        )
    }, [])

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Book", "Read")) {
            redirect("/erro/403")
        }
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Livros</h1>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}
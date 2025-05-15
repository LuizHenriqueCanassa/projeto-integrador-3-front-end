"use client"

import {use, useEffect, useState} from "react";
import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {fetchClient} from "@/app/libs/fetchClient";

export default function Page({params} : { params: Promise<{ id: number }> }) {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const {id} = use(params);
    const [book, setBook] = useState({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        publisher: "",
        publishDate: "",
        isbn: "",
        status: "",
        genreId: 0,
        genre: ""
    });

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    let bookResponse = await response.json();
                    setBook({
                        ...bookResponse,
                        publishDate: bookResponse.publishDate.split(" ")[0],
                    })
                } else if (response.status === 404) {
                    redirect("/dashboard/books");
                }
            },
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
            <h1 className={"text-4xl"}>Detalhes</h1>
            <div className={"mt-10"}>
                <div>
                    <span><b>ID:</b> {book.id} </span>
                </div>
                <div>
                    <span><b>Nome:</b> {book.title} </span>
                </div>
                <div>
                    <span><b>Descrição:</b> {book.description} </span>
                </div>
                <div>
                    <span><b>Gênero:</b> {book.genre}</span>
                </div>
                <div>
                    <span><b>ISBN:</b> {book.isbn}</span>
                </div>
                <div>
                    <span><b>Status:</b> {book.status} </span>
                </div>
                <div>
                    <span><b>Publicadora:</b> {book.publisher} - {book.publishDate.toString()} </span>
                </div>
                <div>
                    <span><b>Imagem: </b></span>
                    <br/>
                    <img src={`${book.imageUrl}`} alt={book.title} />
                </div>
            </div>
        </section>
    )
}
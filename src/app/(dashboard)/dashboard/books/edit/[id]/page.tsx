"use client"

import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import React, {ChangeEvent, use, useEffect, useState} from "react";
import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";
import {fetchClient} from "@/app/libs/fetchClient";
import {Button, Datepicker, Label, Select, Textarea, TextInput} from "flowbite-react";

const Page = ({params} : {params: Promise<{id: number}>}) => {
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
    const [genres, setGenres] = useState([]);

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Book", "Update")) {
            redirect("/erro/403")
        }
    }

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    setGenres(await response.json());
                }
            },
        )

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    setBook(await response.json());
                }
            }
        )
    }, [])

    const onChangeDate = (inputDate: string) => {
        let date = new Date(inputDate);
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        setBook({
            ...book,
            publishDate: formatter.format(date),
        })
    }

    const onChange = (event: React.FormEvent<HTMLFormElement>) => {
        setBook({
            ...book,
            [event.currentTarget.name]: event.currentTarget.value,
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        const data = {
            title: form.get("title"),
            description: form.get("description"),
            imageUrl: form.get("imageUrl"),
            genreId: form.get("genreId"),
            publishDate: form.get("publishDate"),
            publisher: form.get("publisher"),
            isbn: form.get("isbn"),
        }

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`, cookies.get("accessToken"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(
            async (response) => {
                if (response.status === 204) {
                    redirect("/dashboard/books")
                }
            }
        )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Cadastrar Livro</h1>
            <form className={"grid grid-cols-12 gap-x-4 mt-10"} onSubmit={onSubmit}>
                <div className={"col-span-4"}>
                    <div className="block">
                        <Label htmlFor="title">Titulo: </Label>
                    </div>
                    <TextInput id="title" name={"title"} value={book.title} onChange={(e) => onChange(e)} />
                </div>
                <div className={"col-span-4"}>
                    <div className="block">
                        <Label htmlFor="title">Genero: </Label>
                    </div>
                    <Select value={book.genreId} name="genreId" id="genreId" onChange={(e) => onChange(e)}>
                        {genres.map(gen => (
                            <option key={gen.id} value={`${gen.id}`}>{gen.name}</option>
                        ))}
                    </Select>
                </div>
                <div className={"col-span-4"}>
                    <div className="block">
                        <Label htmlFor="isbn">ISBN: </Label>
                    </div>
                    <TextInput id="isbn" name={"isbn"} value={book.isbn} onChange={(e) => onChange(e)} />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="publisher">Publicador: </Label>
                    </div>
                    <TextInput id="publisher" name={"publisher"} value={book.publisher} onChange={(e) => onChange(e)} />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="publishDate">Data de publicação: </Label>
                    </div>
                    <TextInput id="publishDate" name={"publishDate"} value={book.publishDate.split(" ")[0]} readOnly={true} />
                    <Datepicker
                        id={"publishDateTimePicker"}
                        name={"publishDateTimePicker"}
                        language="en-US"
                        labelTodayButton="Hoje"
                        labelClearButton="Limpar"
                        onChange={(date) => onChangeDate(date)}
                    />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="imageUrl">Imagem: </Label>
                    </div>
                    <TextInput id="imageUrl" name={"imageUrl"} value={book.imageUrl} onChange={(e) => onChange(e)}/>
                </div>
                <div className={"col-span-12 mt-5"}>
                    <div className="block">
                        <Label htmlFor="description">Descrição: </Label>
                        <Textarea id="description" name="description" rows={4} value={book.description} onChange={(e) => onChange(e)} />
                    </div>
                </div>
                <div className={"mt-5"}>
                    <Button color={"yellow"} type={"submit"} className={"cursor-pointer"}>
                        Editar
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default Page;
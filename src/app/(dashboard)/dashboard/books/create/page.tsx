"use client"

import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import React, {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {Button, Datepicker, Label, Select, Textarea, TextInput} from "flowbite-react";

export default function Page() {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [genres, setGenres] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState({});

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Book", "Create")) {
            redirect("/erro/403")
        }
    }

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setGenres(await response.json()),
        )
    }, [])

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        let date = new Date(form.get("publishDate"));

        const formatter = new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const data = {
            title: form.get("title"),
            description: form.get("description"),
            imageUrl: form.get("imageUrl"),
            genreId: form.get("genreId"),
            publishDate: formatter.format(date),
            publisher: form.get("publisher"),
            isbn: form.get("isbn"),
        }

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books`, cookies.get("accessToken"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(
            async (response) => {
                console.log(await response)
                if (response.status === 204) {
                    redirect("/dashboard/books")
                } else if(response.status === 400) {
                    let res = await response.json();
                    console.log(res.errors);
                    setHasError(true);
                    setErrorMessage(res.errors)
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
                    <TextInput id="title" name={"title"} />
                </div>
                <div className={"col-span-4"}>
                    <div className="block">
                        <Label htmlFor="title">Genero: </Label>
                    </div>
                    <Select name="genreId" id="genreId">
                        {genres.map(gen => (
                            <option key={gen.id} value={gen.id}>{gen.name}</option>
                        ))}
                    </Select>
                </div>
                <div className={"col-span-4"}>
                    <div className="block">
                        <Label htmlFor="isbn">ISBN: </Label>
                    </div>
                    <TextInput id="isbn" name={"isbn"} />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="publisher">Publicador: </Label>
                    </div>
                    <TextInput id="publisher" name={"publisher"} />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="publishDate">Data de publicação: </Label>
                    </div>
                    <Datepicker name={"publishDate"} language="en-US" labelTodayButton="Hoje" labelClearButton="Limpar" />
                </div>
                <div className={"col-span-4 mt-5"}>
                    <div className="block">
                        <Label htmlFor="imageUrl">Imagem: </Label>
                    </div>
                    <TextInput id="imageUrl" name={"imageUrl"} />
                </div>
                <div className={"col-span-12 mt-5"}>
                    <div className="block">
                        <Label htmlFor="description">Descrição: </Label>
                        <Textarea id="description" name="description" rows={4} />
                    </div>
                </div>
                <div className={"mt-5"}>
                    <Button type={"submit"} className={"cursor-pointer"}>
                        Cadastrar
                    </Button>
                </div>
            </form>
        </section>
    )
}
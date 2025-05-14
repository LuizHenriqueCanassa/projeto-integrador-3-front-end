"use client"

import React, {use, useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {redirect} from "next/navigation";
import {Button, Label, Select, Textarea, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";

export default function Page({params} : { params: Promise<{ id: number }> }) {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const {id} = use(params);
    const [genre, setGenre] = useState({
        name: '',
        description: '',
        isActive: false
    });

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Genre", "Update")) {
            redirect("/erro/403")
        }
    }

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres/${id}`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    let {name, description, isActive} = await response.json();
                    setGenre({
                        name,
                        description,
                        isActive
                    });
                } else if (response.status === 204) {
                    redirect("/dashboard/genre");
                }
            },
        )
    }, [])

    const onChange = (event: React.FormEvent<HTMLFormElement>) => {
        let value = event.currentTarget.value;

        if (value === "true" || value === "false") {
            value = JSON.parse(value);
        }

        setGenre({
            ...genre,
            [event.currentTarget.name]: value,
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres/${id}`, cookies.get("accessToken"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(genre)
        }).then(async (response) => {
            if(response.status === 204) {
                redirect("/dashboard/genre");
            }
        })
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Editar Genero</h1>
            <form className={"grid grid-cols-12 gap-x-4 mt-10"} onSubmit={onSubmit}>
                <div className={"col-span-6"}>
                    <div className="block">
                        <Label htmlFor="name">Nome: </Label>
                    </div>
                    <TextInput id="name" name={"name"} type="name" value={genre.name || ''} onChange={(e) => onChange(e)} />
                </div>
                <div className={"col-span-6"}>
                    <div className="block">
                        <Label htmlFor="isActive">Ativo: </Label>
                    </div>
                    <Select value={genre.isActive} name="isActive" id="isActive" onChange={(e) => onChange(e)}>
                        <option value={"true"} selected={genre.isActive}>Ativo</option>
                        <option value={"false"} selected={!genre.isActive}>Inativo</option>
                    </Select>
                </div>
                <div className={"col-span-12 mt-5"}>
                    <div className="block">
                        <Label htmlFor="description">Descrição: </Label>
                        <Textarea id="description" name="description" rows={4} value={genre.description || ''} onChange={(e) => onChange(e)} />
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
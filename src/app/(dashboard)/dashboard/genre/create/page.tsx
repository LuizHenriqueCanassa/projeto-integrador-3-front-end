"use client"

import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {Alert, Button, Label, Textarea, TextInput} from "flowbite-react";
import React, {useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {getRandomValues} from "node:crypto";

export default function Page() {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState({});

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Genre", "Create")) {
            redirect("/erro/403")
        }
    }

    const createGenre = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        const data ={
            name: form.get("name"),
            description: form.get("description")
        }

        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, cookies.get("accessToken"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(
            async (response) => {
                console.log(await response)
                if (response.status === 204) {
                    redirect("/dashboard/genre")
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
            <h1 className={"text-4xl"}>Cadastrar Genero</h1>
            {hasError && (
                <Alert color="failure" onDismiss={() => setHasError(!hasError)} className={"mt-5"}>
                    <span className="font-medium">Erro!</span>
                    <br/>
                    <br/>
                    {Object.values(errorMessage).map((error) => (
                        <div key={Math.random()}>
                            {error}
                        </div>
                    ))}
                </Alert>
            )}
            <form className={"grid grid-cols-12 gap-x-4 mt-10"} onSubmit={createGenre}>
                <div className={"col-span-12"}>
                    <div className="block">
                        <Label htmlFor="name">Nome: </Label>
                    </div>
                    <TextInput id="name" name={"name"} type="name" />
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
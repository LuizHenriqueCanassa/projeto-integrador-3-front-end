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
    const [genre, setGenre] = useState({
        id: null,
        name: "",
        description: "",
        isActive: false
    });

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres/${id}`, cookies.get("accessToken")).then(
            async (response) => {
                if(response.status === 200) {
                    setGenre(await response.json())
                } else if (response.status === 204) {
                    redirect("/dashboard/genre");
                }
            },
        )
    }, [])

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Genre", "Read")) {
            redirect("/erro/403")
        }
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Detalhes</h1>
            <div className={"mt-10"}>
                <div>
                    <span><b>ID:</b> {genre.id} </span>
                </div>
                <div>
                    <span><b>Nome:</b> {genre.name} </span>
                </div>
                <div>
                    <span><b>Descrição:</b> {genre.description} </span>
                </div>
                <div>
                    <span><b>Status:</b> {genre.isActive ? 'Ativo': 'Inativo'} </span>
                </div>
            </div>
        </section>
    )
}
"use client"

import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {useEffect, useState} from "react";
import {fetchClient} from "@/app/libs/fetchClient";
import {redirect} from "next/navigation";
import hasRole from "@/app/hasRole";
import hasPermission from "@/app/(dashboard)/hasPermission";
import {Alert, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import Link from "next/link";

export default function Page() {
    const {data: session, status} = useSession();
    const cookies = useCookies();
    const [genres, setGenres] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [hasDeleted, setHasDeleted] = useState(false);

    useEffect(() => {
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, cookies.get("accessToken")).then(
            async (response) => response.status === 200 && setGenres(await response.json()),
        )
    }, [hasDeleted])

    if (status === "unauthenticated") {
        redirect("/account/login");
    } else if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
        if (!hasPermission(session?.user.claims, "Genre", "Read")) {
            redirect("/erro/403")
        }
    }

    const deleteGenre = async (id: number) => {
        if (status === "authenticated" && !hasRole(["Root"], session?.user.role)) {
            if (!hasPermission(session?.user.claims, "Genre", "Delete")) {
                redirect("/erro/403")
            }
        }
        fetchClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres/${id}`, cookies.get("accessToken"), {
            method: "DELETE",
        }).then(
            async (response) => {
                if (response.status === 204) {
                    setHasDeleted(true);
                }

                if (response.status === 404) {
                    setHasError(true);
                    setErrorMsg("Genero não encontrado")
                }

                if (response.status === 400) {
                    setHasError(true);
                    setErrorMsg("O genero não pode ser excluido pois existe livros vinculados a ele");
                }
            }
        )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <div className={"flex justify-between"}>
                <h1 className={"text-4xl"}>Generos</h1>
                <Link href={"/dashboard/genre/create"}>
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
                    <span className="font-medium">Sucesso!</span> Genero deletado com sucesso
                </Alert>
            )}
            <div className={"overflow-x-auto mt-10"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Id</TableHeadCell>
                            <TableHeadCell>Nome</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell></TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {genres.map((genre) => (
                            <TableRow key={genre.id}>
                                <TableCell className={"p-4"}>{genre.id}</TableCell>
                                <TableCell className={"p-4"}>{genre.name}</TableCell>
                                <TableCell className={"p-4"}>{genre.isActive ? "Ativo" : "Inativo"}</TableCell>
                                <TableCell className={"w-80"}>
                                    <div className={"inline-flex rounded-md shadow-xs"} role="group">
                                        <Link href={`/dashboard/genre/details/${genre.id}`} >
                                            <Button className={"mr-3 cursor-pointer"}>Detalhes</Button>
                                        </Link>
                                        <Link href={`/dashboard/genre/edit/${genre.id}`}>
                                            <Button color={"yellow"} className={"mr-3 cursor-pointer"}>
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button color={"red"} className={"cursor-pointer"} onClick={() => deleteGenre(genre.id)}>
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
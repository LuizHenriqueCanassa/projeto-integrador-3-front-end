"use client"

import {Badge, Button, Select, TextInput} from "flowbite-react";
import React, {useEffect, useState} from "react";
import Link from "next/link";

const Page = () => {
    const [genres, setGenres] = useState<any[]>([]);
    const [books, setBooks] = useState<any>([]);
    const [searchParams, setSearchParams] = useState({
        title: "",
        genreId: ""
    });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`).then(
            async (response) => response.status === 200 && setGenres(await response.json()),
        )
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books`).then(
            async (response) => response.status === 200 && setBooks(await response.json()),
        )
    }, []);

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams({
            ...searchParams,
            [event.currentTarget.name]: event.currentTarget.value,
        });
    }

    const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/books?Title=${searchParams.title}&GenreId=${searchParams.genreId}`)
            .then(
                async (response) => response.status === 200 && setBooks(await response.json()),
            )
    }

    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-4xl"}>Catalogo</h1>
            <form onSubmit={onSearchSubmit}>
                <div className={'grid grid-cols-12 gap-x-4 mt-5'}>
                    <div className={'col-span-5'}>
                        <TextInput name={"title"} placeholder={"Buscar por Titulo"} value={searchParams.title} onChange={(e) => onSearchChange(e)} />
                    </div>
                    <div className={'col-span-5'}>
                        <Select name="genreId" id="genreId" value={searchParams.genreId != "" ? searchParams.genreId : ""} onChange={(e) => onSearchChange(e)}>
                            <option value=""></option>
                            {genres.map(gen => (
                                <option key={gen.id} value={gen.id}>{gen.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div className={"col-span-2"}>
                        <Button type={"submit"} className={"w-55 cursor-pointer"} color={"default"}>Pesquisar</Button>
                    </div>
                </div>
            </form>
            <div className={"mt-10 grid grid-cols-12 gap-x-4"}>
                {books.length > 0 ? books.map((book : any) => (
                    <div className={"col-span-3"} key={book.id}>
                        <Link href={`/catalogo/book/${book.id}`}>
                            <div className={"book-box"}>
                                <div className={"book-box-image"}>
                                    <img src={book.imageUrl} alt=""/>
                                </div>
                                <div className={"book-box-title"}>
                                    <h4>{book.title}</h4>
                                </div>
                                <div className={"book-box-genre"}>
                                    <h5>{book.genre}</h5>
                                </div>
                                <div className={"book-box-status"}>
                                    {book.status === "Alugado"
                                        ? <Badge color={"failure"}>{book.status}</Badge>
                                        : <Badge color={"success"}>{book.status}</Badge>
                                    }
                                </div>
                            </div>
                        </Link>
                    </div>
                )) : <div className={"col-span-12 text-center mr-10"}>
                    <h1 className={"text-2xl "}>Nenhum Livro Encontrado!</h1>
                </div>}
            </div>
        </section>
    )
}

export default Page;
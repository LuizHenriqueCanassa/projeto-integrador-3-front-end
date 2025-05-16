"use client";

import Link from "next/link";
import {signOut, useSession} from "next-auth/react";

export default function NavBarDashboard() {
    const {data: session, status} = useSession();
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto container">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link href={"/dashboard"} className={"text-white"}>
                                Biblioteca - Dashboard
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/"
                                      className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}>
                                    Pagina Inicial
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/dashboard/loans"
                                      className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}>
                                    Alugueis
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/dashboard/books"
                                      className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}>
                                    Livros
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/dashboard/genre"
                                      className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}>
                                    Gêneros
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {status === "authenticated" && (
                            <div className="relative ml-3">
                                <div className="flex space-x-4 text-white">
                                    <div className={"mt-2"}>
                                        Olá, {session?.user.fullName}
                                    </div>
                                    <a
                                        onClick={() => signOut()}
                                        className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}
                                    >
                                        Sair
                                    </a>
                                </div>

                            </div>
                        )}
                        {status === "unauthenticated" && (
                            <div className="relative ml-3">
                                <div className="flex space-x-4">
                                    <Link
                                        href={"/src/app/(home)/account/login"}
                                        className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={"/src/app/(home)/account/register"}
                                        className={"rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"}
                                    >
                                        Registrar
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                       aria-current="page">Dashboard</a>
                    <a href="#"
                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                    <a href="#"
                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
                    <a href="#"
                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                </div>
            </div>
        </nav>

    )
}
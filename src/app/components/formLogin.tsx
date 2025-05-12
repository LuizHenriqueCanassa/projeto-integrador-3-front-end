"use client";

import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import React from "react";

export default function LoginForm() {

    const searchParams = useSearchParams();

    const error = searchParams.get("error");

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = new FormData(event.currentTarget);

        const data ={
            email: form.get("email"),
            password: form.get("password")
        }

        await signIn("credentials", {
            ...data,
            callbackUrl: "/dashboard"
        })
    }

    return (
        <section className={"container mx-auto items-center flex justify-center mt-10"}>
            <div>
                <h1 className={"text-2xl"}>Login</h1>
                {error === "CredentialsSignin" && (
                    <div className="bg-red-100 mt-10 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">Usuário ou senha Invalido</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"><title>Close</title><path
        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
                    </div>
                )}
                <div className={"mt-10"}>
                    <form onSubmit={login}>
                        <div className={"mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"}>
                            <div className="sm:col-span-6">
                                <label htmlFor="email" className={"text-sm/6 font-medium text-gray-900"}>
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input type="email" name="email" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="password" className={"block text-sm/6 font-medium text-gray-900"}>
                                    Senha
                                </label>
                                <div className="mt-2">
                                    <input type="password" name="password" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                                </div>
                            </div>
                            <button type={"submit"} className={"submit-button mt-10"}>Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
"use client"

import {redirect} from "next/navigation";
import {useState} from "react";

export default function Page() {

    const [hasErrors, setHasErrors] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async event => {
        event.preventDefault();

        setIsLoading(true);

        const data = {}
        let doRedirect = false;
        const form = Object.fromEntries(new FormData(event.currentTarget));

        for (const [key, value] of Object.entries(form)) {
            if (key.includes("[")) {
                const parts = key.split(/\[|\]/g).filter(Boolean);
                if (!data[parts[0]]) {
                    data[parts[0]] = {};
                }
                data[parts[0]][parts[1]] = value;
            } else {
                data[key] = value;
            }
        }

        await fetch("https://projetointegrador3.onrender.com/api/v1/account/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            const data  = response.json();
            if (response.status === 204)  {
                doRedirect = true;
            }

            if (response.status === 400) {
                setHasErrors(true)
            }

            setIsLoading(false);

            return data;
        }).catch((error) => {
            setIsLoading(false);
            setHasErrors(true);
        })

        if (doRedirect) {
            redirect("/account/login");
        }
    }
    return (
        <section className={"container mx-auto mt-10"}>
            <h1 className={"text-2xl"}>Realizar cadastro</h1>
            {hasErrors && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">Erro ao realizar seu cadastro</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"><title>Close</title><path
        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
                </div>
            )}

            {isLoading && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">Estamos realizando  seu cadastro</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-orange-500" role="button" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"><title>Close</title><path
        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
                </div>
            )}
            <div className={"mt-10"}>
                <form onSubmit={handleRegister}>
                    <div className={"mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"}>
                        <div className="sm:col-span-3">
                            <label htmlFor="fullname" className={"block text-sm/6 font-medium text-gray-900"}>
                                Nome Completo
                            </label>
                            <div className="mt-2">
                                <input type="text" name="fullname"
                                       className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className={"block text-sm/6 font-medium text-gray-900"}>
                                Email
                            </label>
                            <div className="mt-2">
                                <input type="email" name="email" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                    </div>
                    <div className={"mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"}>
                        <div className="sm:col-span-3">
                            <label htmlFor="password" className={"block text-sm/6 font-medium text-gray-900"}>
                                Senha
                            </label>
                            <div className="mt-2">
                                <input type="text" name="password" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="confirmPassword" className={"block text-sm/6 font-medium text-gray-900"}>
                                Confirmar Senha
                            </label>
                            <div className="mt-2">
                                <input type="password" name="confirmPassword" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                    </div>
                    <div className={"mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"}>
                        <div className="sm:col-span-2">
                            <label htmlFor="address[streetAddress]" className={"block text-sm/6 font-medium text-gray-900"}>
                                Rua
                            </label>
                            <div className="mt-2">
                                <input type="text" name="address[streetAddress]" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="address[streetNumber]" className={"block text-sm/6 font-medium text-gray-900"}>
                                Numero
                            </label>
                            <div className="mt-2">
                                <input type="text" name="address[streetNumber]" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="address[city]" className={"block text-sm/6 font-medium text-gray-900"}>
                                Cidade
                            </label>
                            <div className="mt-2">
                                <input type="text" name="address[city]" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="address[state]" className={"block text-sm/6 font-medium text-gray-900"}>
                                Estado
                            </label>
                            <div className="mt-2">
                                <input type="text" name="address[state]" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="address[zip]" className={"block text-sm/6 font-medium text-gray-900"}>
                                CEP
                            </label>
                            <div className="mt-2">
                                <input type="text" name="address[zip]" className={"block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"} />
                            </div>
                        </div>
                    </div>
                    <button type={"submit"} className={"submit-button mt-10"}>Cadastrar</button>
                </form>
            </div>
        </section>
    )
}
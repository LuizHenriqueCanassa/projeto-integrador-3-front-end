import {ReactNode} from "react";
import "../globals.css"
import NavBarDashboard from "@/app/components/navBarDashboard";
import {Providers} from "@/app/providers";
import {ThemeConfig} from "flowbite-react";
import {CookiesProvider} from "next-client-cookies/server";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Projeto Integrador 3 - Biblioteca Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-br">
        <body>
        <Providers>
            <CookiesProvider>
                <ThemeConfig dark={false}/>
                <div>
                    <NavBarDashboard />
                    {children}
                </div>
            </CookiesProvider>
        </Providers>
        </body>
        </html>
    )
}
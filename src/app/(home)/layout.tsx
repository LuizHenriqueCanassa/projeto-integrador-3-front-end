import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import NavBar from "@/app/components/navBar";
import {Providers} from "@/app/providers";
import {ThemeConfig} from "flowbite-react";
import {CookiesProvider} from "next-client-cookies/server";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Projeto Integrador 3 - Biblioteca",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
            <CookiesProvider>
                <ThemeConfig dark={false}/>
                <div>
                    <NavBar/>
                    {children}
                </div>
            </CookiesProvider>
        </Providers>
        </body>
        </html>
    );
}

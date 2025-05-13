import {ReactNode} from "react";
import {Providers} from "@/app/providers";

export default function ErrosLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-br">
        <body>
        <Providers>
            <div>
                {children}
            </div>
        </Providers>
        </body>
        </html>
    )
}
import LoginForm from "@/app/components/formLogin";
import {Suspense} from "react";

export default function Page() {
    return (
        <>
            <Suspense>
                <LoginForm />
            </Suspense>
        </>
    )
}
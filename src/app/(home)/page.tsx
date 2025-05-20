import {Button} from "flowbite-react";
import Link from "next/link";

export default function Home() {
  return (
      <section className="initial-page">
        <div>
          <h1>Bem vindo a biblioteca municipal</h1>
          <div className={"btn-group"}>
            <Link href={"/catalogo"}>
                <Button>Catalogo</Button>
            </Link>
            <Link href={"/loans"}>
                <Button>Meus Alugueis</Button>
            </Link>
          </div>
        </div>
      </section>
  );
}

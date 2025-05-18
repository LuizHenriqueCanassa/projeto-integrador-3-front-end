import {Button} from "flowbite-react";

export default function Home() {
  return (
      <section className="initial-page">
        <div>
          <h1>Bem vindo a biblioteca municipal</h1>
          <div className={"btn-group"}>
            <Button>Catalogo</Button>
            <Button>Meus Alugueis</Button>
          </div>
        </div>
      </section>
  );
}

import { ORG_NAME } from "@/lib/site";

export const metadata = {
  title: "Empresa",
};

const valores: {
  titulo: string;
  texto: string;
  marca: string;
  fundo: string;
}[] = [
  {
    titulo: "Empatia",
    marca: "Empatia",
    fundo:
      "from-[#F2C94C]/[0.12] via-white to-[#F2994A]/[0.08] bg-gradient-to-br",
    texto:
      "Para ser um Inventer é preciso ter empatia. Aqui as pessoas estão em primeiro lugar, logo esse é o nosso principal atributo. Mais que colegas de trabalho, nós temos amigos e valorizamos as relações humanas ao prezar pelos colaboradores, parceiros e clientes, sempre nos colocando no lugar do outro.",
  },
  {
    titulo: "Crescimento",
    marca: "Crescimento",
    fundo:
      "from-[#F2994A]/[0.1] via-white to-[#F2C94C]/[0.1] bg-gradient-to-bl",
    texto:
      "Além de promover o sucesso e crescimento dos nossos clientes, também impulsionamos os nossos colaboradores. Buscamos capacitações e aprendizados constantes, pois quando um Inventer se desenvolve nós crescemos juntos.",
  },
  {
    titulo: "Performance",
    marca: "Performance",
    fundo:
      "from-white via-[#F2C94C]/[0.09] to-[#F2994A]/[0.07] bg-gradient-to-tr",
    texto:
      "Não criamos apenas produtos, desenvolvemos soluções inovadoras que garantem a agilidade e praticidade do usuário, mas principalmente a performance dos nossos clientes e colaboradores. Trabalhamos juntos para entregar os melhores recursos e promover resultados surpreendentes.",
  },
  {
    titulo: "Persistência",
    marca: "Persistência",
    fundo:
      "from-[#F7F8FA] via-[#F2C94C]/[0.11] to-white bg-gradient-to-br",
    texto:
      "Um dos nossos lemas é nunca desistir. Acreditamos que problemas podem ser resolvidos pela união de forças, por isso aqui ninguém fica só. Seja cliente, parceiro ou colaborador, todos sabem que podem contar com a gente, pois juntos vamos até o fim.",
  },
  {
    titulo: "Comprometimento",
    marca: "Comprometimento",
    fundo:
      "from-[#F2994A]/[0.08] via-white to-[#F2C94C]/[0.1] bg-gradient-to-tl",
    texto:
      "Nosso compromisso vai além das soluções que oferecemos. Somos engajados, responsáveis e dedicados, prezando sempre a qualidade, seja nas relações humanas ou em nossas entregas.",
  },
];

export default function EmpresaPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-[#1F2937]">Empresa</h1>
        <p className="mt-2 text-[#6B7280]">
          Conheça um pouco da cultura e dos valores da {ORG_NAME}.
        </p>
      </header>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">Quem somos</h2>
        <p className="mt-3 leading-relaxed text-[#6B7280]">
          Somos mais que uma empresa de tecnologia. Compartilhamos valores que
          vão além dos números e contabilizam mais de 10 anos de história. Tudo
          isso contribuiu para a construção de uma cultura que verdadeiramente
          reflete o jeito Inventer de ser. Vamos embarcar nessa jornada juntos?
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1F2937]">Valores</h2>
        <div className="grid gap-5 md:grid-cols-1">
          {valores.map((v) => (
            <article
              key={v.titulo}
              className={`relative overflow-hidden rounded-xl border border-[#E5E7EB] p-6 shadow-sm ${v.fundo}`}
            >
              <p
                className="pointer-events-none absolute -right-2 -top-4 select-none font-bold leading-none text-[#F2C94C]/[0.14] max-[480px]:text-[4.5rem] text-[6rem] sm:text-[7rem]"
                aria-hidden
              >
                {v.marca}
              </p>
              <h3 className="relative text-base font-semibold text-[#1F2937]">
                {v.titulo}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-[#6B7280]">
                {v.texto}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Suspense } from "react";
import Confetti from "./confetti";

const numberFormatter = new Intl.NumberFormat("pt-BR");

async function getTotalPublishedContents() {
  try {
    const response = await fetch("https://www.tabnews.com.br/api/v1/contents?strategy=new&page=1&per_page=1", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });

    const totalRows = response.headers.get("x-pagination-total-rows");
    await response.body?.cancel();

    if (!response.ok || !totalRows) {
      return null;
    }

    return numberFormatter.format(Number(totalRows));
  } catch {
    return null;
  }
}

const totalContentsFallback = <strong className="stats-value">...</strong>;

async function TotalContentsValue() {
  const totalContents = await getTotalPublishedContents();
  return <strong className="stats-value">{totalContents ?? "Indisponível"}</strong>;
}

export default function Home() {
  return (
    <main className="container">
      <Confetti />
      <section className="card">
        <span className="badge">TabNews</span>
        <h1 className="title">Em Construção</h1>
        <p className="description">
          Estamos neste exato momento reconstruindo o TabNews, um lugar na internet para quem trabalha com tecnologia e
          precisa consumir conteúdos com valor concreto
        </p>
        <div className="stats">
          <span className="stats-label">Total de conteúdos publicados no TabNews</span>
          <Suspense fallback={totalContentsFallback}>
            <TotalContentsValue />
          </Suspense>
        </div>
        <a className="link" href="https://www.tabnews.com.br" target="_blank" rel="noopener noreferrer">
          Acessar o site oficial do TabNews
        </a>
      </section>
    </main>
  );
}

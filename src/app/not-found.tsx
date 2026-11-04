import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#130e0c] text-[#f2e0db]">
      <h2 className="text-2xl font-bold mb-2">Página não encontrada</h2>
      <p className="text-sm text-[#9e908a] mb-6">
        A página requisitada não foi encontrada no sistema Megasnem.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-[#f59f7a] text-[#4a2800] text-sm font-semibold hover:bg-[#ffb595] transition"
      >
        Voltar para Mensagens
      </Link>
    </div>
  );
}

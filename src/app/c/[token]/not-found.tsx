import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Checklist introuvable</h1>
      <p className="text-gray-500 mb-6">
        Ce lien ne correspond à aucune checklist. Vérifiez l&apos;URL ou créez-en une nouvelle.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}

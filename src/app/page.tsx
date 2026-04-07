import { CreateChecklistForm } from "@/components/CreateChecklistForm";
import { RecentChecklists } from "@/components/RecentChecklists";

export default function Home() {
  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          VacaCheck
        </h1>
        <p className="text-gray-500 mt-2">
          Organisez vos vacances sans rien oublier
        </p>
      </div>

      <CreateChecklistForm />
      <RecentChecklists />
    </main>
  );
}

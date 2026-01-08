import { Users, Baby } from "lucide-react";
import { PregnancyCard } from "./pregnancy-card";
import type { PregnantWomen } from "@/server/lib/appwrite.types";

interface PregnancyListProps {
  women: PregnantWomen[];
  onDelete: (id: string) => void;
  onEdit: (woman: PregnantWomen) => void;
  deletingId?: string | null;
}

export function PregnancyList({
  women,
  onDelete,
  onEdit,
  deletingId,
}: PregnancyListProps) {
  if (women.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mb-4">
          <Baby className="w-10 h-10 text-pink-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          No patients yet
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          Add your first patient using the form to start tracking pregnancy
          progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <Users className="w-5 h-5" />
        <h2 className="font-semibold text-lg">All Patients ({women.length})</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {women.map((woman) => (
          <PregnancyCard
            key={woman.$id}
            woman={woman}
            onDelete={onDelete}
            onEdit={onEdit}
            isDeleting={deletingId === woman.$id}
          />
        ))}
      </div>
    </div>
  );
}

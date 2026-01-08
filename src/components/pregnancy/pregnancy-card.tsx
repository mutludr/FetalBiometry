import { format } from "date-fns";
import { Calendar, Trash2, Baby, Clock, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GestationalAge, calculateGestationalAge } from "./gestational-age";
import type { PregnantWomen } from "@/server/lib/appwrite.types";

interface PregnancyCardProps {
  woman: PregnantWomen;
  onDelete: (id: string) => void;
  onEdit: (woman: PregnantWomen) => void;
  isDeleting?: boolean;
}

export function PregnancyCard({
  woman,
  onDelete,
  onEdit,
  isDeleting,
}: PregnancyCardProps) {
  const { dueDate } = calculateGestationalAge(woman.lastMenstrualPeriod);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-pink-100 bg-gradient-to-br from-white to-pink-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center">
              <Baby className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800">
                {woman.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  LMP:{" "}
                  {format(new Date(woman.lastMenstrualPeriod), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              onClick={() => onEdit(woman)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => onDelete(woman.$id)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <GestationalAge lastMenstrualPeriod={woman.lastMenstrualPeriod} />

        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg p-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>
            Due: <strong>{format(dueDate, "MMMM d, yyyy")}</strong>
          </span>
        </div>

        {woman.notes && (
          <div className="text-sm text-gray-600 bg-white/60 rounded-lg p-3 border-l-2 border-pink-200">
            {woman.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

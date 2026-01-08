import { useState } from "react";
import { toast } from "sonner";
import { Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PregnancyCalculator } from "./pregnancy-calculator";
import { PregnancyList } from "./pregnancy-list";
import { EditPatientDialog } from "./edit-patient-dialog";
import {
  createPregnantWomanFn,
  deletePregnantWomanFn,
  updatePregnantWomanFn,
} from "@/server/functions/pregnant-women";
import type { PregnantWomen } from "@/server/lib/appwrite.types";
import type { Models } from "node-appwrite";
import { Link } from "@tanstack/react-router";

interface PregnancyTrackerProps {
  initialWomen: PregnantWomen[];
  currentUser: Models.User<Models.Preferences> | null;
}

export function PregnancyTracker({
  initialWomen,
  currentUser,
}: PregnancyTrackerProps) {
  const [women, setWomen] = useState<PregnantWomen[]>(initialWomen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<PregnantWomen | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddPatient = async (data: {
    name: string;
    lastMenstrualPeriod: string;
    notes: string | null;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await createPregnantWomanFn({ data });
      setWomen((prev) => [result.pregnantWoman, ...prev]);
      toast.success("Patient added successfully!");
    } catch (error) {
      toast.error("Failed to add patient. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePregnantWomanFn({ data: { id } });
      setWomen((prev) => prev.filter((w) => w.$id !== id));
      toast.success("Patient removed successfully.");
    } catch (error) {
      toast.error("Failed to remove patient. Please try again.");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditPatient = (patient: PregnantWomen) => {
    setEditingPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleSavePatient = async (data: {
    id: string;
    name: string;
    lastMenstrualPeriod: string;
    notes: string | null;
  }) => {
    setIsSaving(true);
    try {
      const result = await updatePregnantWomanFn({
        data: {
          id: data.id,
          name: data.name,
          lastMenstrualPeriod: data.lastMenstrualPeriod,
          notes: data.notes,
        },
      });
      setWomen((prev) =>
        prev.map((w) => (w.$id === data.id ? result.pregnantWoman : w)),
      );
      setIsEditDialogOpen(false);
      setEditingPatient(null);
      toast.success("Patient updated successfully!");
    } catch (error) {
      toast.error("Failed to update patient. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-orange-300 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Pregnancy Tracker
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Calculate gestational age and track pregnancy progress with ease
            </p>
          </header>

          {/* Sign in prompt */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-pink-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-pink-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Sign in to get started
              </h2>
              <p className="text-gray-500 mb-6">
                Create an account or sign in to start tracking your patients'
                pregnancies.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white"
                >
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-pink-200 text-slate-700 hover:bg-pink-50"
                >
                  <Link to="/sign-up">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-orange-300 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Pregnancy Tracker
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Calculate gestational age and track pregnancy progress with ease
          </p>
        </header>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left column - Form */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <PregnancyCalculator
                onSubmit={handleAddPatient}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right column - List */}
            <div>
              <PregnancyList
                women={women}
                onDelete={handleDeletePatient}
                onEdit={handleEditPatient}
                deletingId={deletingId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditPatientDialog
        patient={editingPatient}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingPatient(null);
        }}
        onSave={handleSavePatient}
        isSaving={isSaving}
      />
    </div>
  );
}

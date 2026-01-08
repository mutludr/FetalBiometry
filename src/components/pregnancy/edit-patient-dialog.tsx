import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { GestationalAge } from "./gestational-age";
import type { PregnantWomen } from "@/server/lib/appwrite.types";

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  lastMenstrualPeriod: z.date({
    message: "Please select the last menstrual period date",
  }),
  notes: z.string().max(1000).optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface EditPatientDialogProps {
  patient: PregnantWomen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    id: string;
    name: string;
    lastMenstrualPeriod: string;
    notes: string | null;
  }) => Promise<void>;
  isSaving?: boolean;
}

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: EditPatientDialogProps) {
  const [previewDate, setPreviewDate] = useState<Date | null>(null);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  // Reset form when patient changes
  useEffect(() => {
    if (patient && open) {
      const lmpDate = new Date(patient.lastMenstrualPeriod);
      form.reset({
        name: patient.name,
        lastMenstrualPeriod: lmpDate,
        notes: patient.notes || "",
      });
      setPreviewDate(lmpDate);
    }
  }, [patient, open, form]);

  const handleSubmit = async (values: EditFormValues) => {
    if (!patient) return;

    await onSave({
      id: patient.$id,
      name: values.name,
      lastMenstrualPeriod: format(values.lastMenstrualPeriod, "yyyy-MM-dd"),
      notes: values.notes || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-pink-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800">
            Edit Patient
          </DialogTitle>
          <DialogDescription>
            Update patient information and pregnancy details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Patient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter patient name"
                      className="border-pink-200 focus:border-orange-300 focus:ring-orange-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastMenstrualPeriod"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-slate-700">
                    Last Menstrual Period (LMP)
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal border-pink-200 hover:bg-pink-50",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setPreviewDate(date || null);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewDate && (
              <div className="p-4 bg-gradient-to-br from-pink-50/50 to-orange-50/50 rounded-lg border border-pink-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  Gestational Age Preview
                </p>
                <GestationalAge
                  lastMenstrualPeriod={format(previewDate, "yyyy-MM-dd")}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">
                    Notes (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant notes..."
                      className="border-pink-200 focus:border-orange-300 focus:ring-orange-200 resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-pink-200 text-slate-700 hover:bg-pink-50"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

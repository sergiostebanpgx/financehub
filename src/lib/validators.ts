import { ZodError, z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(40, "El nombre no puede superar los 40 caracteres."),
  color: z
    .string({ message: "El color es obligatorio." })
    .regex(/^#([A-Fa-f0-9]{6})$/, "Color invalido. Usa formato hexadecimal."),
  icon: z.string().trim().max(30).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar.",
  });

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "El tipo de transaccion no es valido.",
  }),
  amount: z.coerce
    .number()
    .positive("El valor debe ser mayor que cero.")
    .max(1_000_000_000, "El valor supera el limite permitido."),
  description: z
    .string({ message: "La descripcion es obligatoria." })
    .trim()
    .min(3, "La descripcion debe tener al menos 3 caracteres.")
    .max(120, "La descripcion no puede superar los 120 caracteres."),
  date: z.coerce.date({ message: "Fecha invalida." }),
  categoryId: z
    .string({ message: "Debes seleccionar una categoria." })
    .trim()
    .min(1, "Debes seleccionar una categoria."),
  notes: z
    .string()
    .trim()
    .max(300, "Las notas no pueden superar los 300 caracteres.")
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar.",
  });

export const createSavingGoalSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(40, "El nombre no puede superar los 40 caracteres."),
  targetAmount: z.coerce
    .number()
    .positive("El valor meta debe ser mayor que cero."),
  savedAmount: z.coerce
    .number()
    .min(0, "El valor ahorrado no puede ser negativo.")
    .optional()
    .default(0),
});

export const updateSavingGoalSchema = createSavingGoalSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar.",
  });

export const createDebtSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(40, "El nombre no puede superar los 40 caracteres."),
  totalAmount: z.coerce
    .number()
    .positive("El valor total debe ser mayor que cero."),
  paidAmount: z.coerce
    .number()
    .min(0, "El valor pagado no puede ser negativo.")
    .optional()
    .default(0),
});

export const updateDebtSchema = createDebtSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar.",
  });

export function getValidationMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Los datos enviados no son validos.";
  }

  return "Los datos enviados no son validos.";
}

import type { Prisma } from "@prisma/client";

const prismaErrorMessage: Record<string, string> = {
  P2002: "Unique constraint violation",
  P2003: "Foreign key constraint failed",
  P2025: "Record not found",
};

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): string => {
  const message = prismaErrorMessage[err.code] || "An unexpected database error occurred";
  const targetField = Array.isArray(err.meta?.target) ? (err.meta.target as string[]).join(", ") : "Unknown field";
  
  return `${message}: ${targetField}`;
}
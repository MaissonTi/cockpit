"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentProps } from "react";

interface TInputProps extends ComponentProps<"input"> {
  name: string;
  label?: string;
  error?: Record<string, string[]> | null;
}

export function TInput({ name, label, error, ...props }: TInputProps) {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} id={name} {...props} />

      {error && error[name] && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error[name][0]}
        </p>
      )}
    </>
  );
}

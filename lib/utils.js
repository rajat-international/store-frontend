import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export  const categoryname = [
  { value: "Sifly", label: "Sifly" },
  { value: "Cotton-handloom-denim", label: "Cotton-handloom-denim" },
]
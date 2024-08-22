import { twMerge } from "tailwind-merge"
import { clsx, ClassValue } from "clsx"

export const joinClasses = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateGradient(index: number) {
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-green-400 to-blue-500",
    "from-purple-400 via-pink-500 to-red-500",
    "from-yellow-400 via-red-500 to-pink-500",
    "from-green-500 to-blue-600",
    "from-purple-600 to-blue-600",
    "from-pink-400 to-red-600",
    "from-indigo-500 via-purple-500 to-pink-500"
  ];
  return gradients[index % gradients.length];
}

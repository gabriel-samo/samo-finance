import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes intelligently.
 *
 * @param inputs - An array of class values which can be strings, arrays, or objects.
 * @returns A single string with all the class names combined and merged.
 *
 * This function uses `clsx` to conditionally join class names and `twMerge` to merge Tailwind CSS classes.
 * Example usage:
 * const className = cn('p-4', 'text-center', isActive && 'bg-blue-500');
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an amount from miliunits to units.
 *
 * @param amount - The amount in miliunits (1 unit = 1000 miliunits).
 * @returns The amount converted to units.
 *
 * This function is useful when you need to display or process amounts in standard units
 * instead of miliunits. For example, if the amount is 1500 miliunits, the function will return 1.5 units.
 */
export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

/**
 * Converts an amount from units to miliunits.
 *
 * @param amount - The amount in units.
 * @returns The amount converted to miliunits (1 unit = 1000 miliunits).
 *
 * This function is useful when you need to store or process amounts in miliunits
 * for higher precision. For example, if the amount is 1.5 units, the function will return 1500 miliunits.
 */
export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

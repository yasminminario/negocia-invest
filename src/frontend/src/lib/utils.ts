import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const PROFILE_CLASS = {
    investidor: "theme-investor",
    tomador: "theme-borrower",
} as const

type ProfileKey = keyof typeof PROFILE_CLASS

export function applyProfileTheme(profile: ProfileKey) {
    const root = document.documentElement
    const classes = Object.values(PROFILE_CLASS)
    classes.forEach((c) => root.classList.remove(c))
    root.classList.add(PROFILE_CLASS[profile])
}

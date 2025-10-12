import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import { applyProfileTheme } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export type ActiveProfile = "investidor" | "tomador"

interface ProfileContextValue {
    activeProfile: ActiveProfile
    setActiveProfile: (profile: ActiveProfile) => void
    availableProfiles: ActiveProfile[]
    isInvestor: boolean
    isBorrower: boolean
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

const PROFILE_KEY = "ni.activeProfile"

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [activeProfile, setActiveProfileState] = useState<ActiveProfile>("tomador")

    const availableProfiles = useMemo<ActiveProfile[]>(() => {
        if (!user?.perfis?.length) return ["tomador"]
        return user.perfis.filter((perfil): perfil is ActiveProfile =>
            perfil === "investidor" || perfil === "tomador"
        )
    }, [user?.perfis])

    const setActiveProfile = useCallback((profile: ActiveProfile) => {
        setActiveProfileState(profile)
        localStorage.setItem(PROFILE_KEY, profile)
        applyProfileTheme(profile)
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem(PROFILE_KEY) as ActiveProfile | null
        if (stored && availableProfiles.includes(stored)) {
            setActiveProfile(stored)
            return
        }
        const fallback = (availableProfiles[0] ?? "tomador") as ActiveProfile
        setActiveProfile(fallback)
    }, [availableProfiles, setActiveProfile])

    const value = useMemo(
        () => ({
            activeProfile,
            setActiveProfile,
            availableProfiles,
            isInvestor: activeProfile === "investidor",
            isBorrower: activeProfile === "tomador",
        }),
        [activeProfile, availableProfiles, setActiveProfile]
    )

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useProfile must be used within ProfileProvider")
    }
    return context
}

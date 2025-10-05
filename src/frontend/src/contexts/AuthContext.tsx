import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "negocia.ai.auth";

export type ProfileType = "tomador" | "investidor";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    profiles: ProfileType[];
    defaultProfile?: ProfileType;
    [key: string]: unknown;
}

interface PersistedAuthState {
    user: AuthUser;
    activeProfile: ProfileType | null;
    hasChosenProfile?: boolean;
}

export interface AuthContextValue {
    user: AuthUser | null;
    activeProfile: ProfileType | null;
    loading: boolean;
    hasChosenProfile: boolean;
    login: (userData: AuthUser) => void;
    logout: () => void;
    switchProfile: (profile: ProfileType) => void;
    confirmProfileSelection: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [activeProfile, setActiveProfile] = useState<ProfileType | null>(null);
    const [hasChosenProfile, setHasChosenProfile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const storedState = window.localStorage.getItem(STORAGE_KEY);

        if (!storedState) {
            setLoading(false);
            return;
        }

        try {
            const parsedState = JSON.parse(storedState) as PersistedAuthState;
            if (parsedState.user) {
                setUser(parsedState.user);
                setActiveProfile(
                    parsedState.activeProfile ??
                    parsedState.user.defaultProfile ??
                    parsedState.user.profiles?.[0] ??
                    null,
                );
                setHasChosenProfile(parsedState.hasChosenProfile ?? false);
            }
        } catch (error) {
            console.error("Failed to parse persisted auth state", error);
            window.localStorage.removeItem(STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || loading) {
            return;
        }

        if (user) {
            const payload: PersistedAuthState = {
                user,
                activeProfile,
                hasChosenProfile,
            };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, [user, activeProfile, loading]);

    const login = useCallback((userData: AuthUser) => {
        setUser(userData);
        setActiveProfile(
            userData.defaultProfile ?? userData.profiles?.[0] ?? null,
        );
        setHasChosenProfile(false);
        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setActiveProfile(null);
        setHasChosenProfile(false);
        setLoading(false);
    }, []);

    const confirmProfileSelection = useCallback(() => {
        setHasChosenProfile(true);
    }, []);

    const switchProfile = useCallback(
        (profile: ProfileType) => {
            setActiveProfile((current) => {
                if (current === profile) {
                    return current;
                }
                if (user && !user.profiles.includes(profile)) {
                    console.warn(
                        `Profile "${profile}" is not available for the current user.`,
                    );
                }
                return profile;
            });
        },
        [user],
    );

    const value = useMemo<AuthContextValue>(
        () => ({ user, activeProfile, loading, hasChosenProfile, login, logout, switchProfile, confirmProfileSelection }),
        [user, activeProfile, loading, hasChosenProfile, login, logout, switchProfile, confirmProfileSelection],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
};

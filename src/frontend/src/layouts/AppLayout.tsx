import { useCallback, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Header } from "@/components/Header";
import { useAuth, type ProfileType } from "@/contexts/AuthContext";

const INVESTOR_PATH_FRAGMENT = "/app/investidor";
const BORROWER_PATH_FRAGMENT = "/app/tomador";

const mapProfileToUserType = (p: ProfileType | null) => (p === "investidor" ? "investor" : "borrower");
const mapUserTypeToProfile = (t: "borrower" | "investor") => (t === "investor" ? "investidor" : "tomador");

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeProfile, switchProfile } = useAuth();

    // Sync a CSS variable with the active profile so the UI can react globally
    useEffect(() => {
        const primaryColor = activeProfile === "investidor" ? "#9B59B6" : "#57D9FF";
        document.documentElement.style.setProperty("--primary-color", primaryColor);

        return () => {
            // optional cleanup: do not remove the variable to keep current theme
        };
    }, [activeProfile]);

    const handleUserTypeChange = useCallback((type: "borrower" | "investor") => {
        const targetProfile = mapUserTypeToProfile(type);
        // update auth state
        switchProfile(targetProfile);

        // navigate to the corresponding dashboard
        const targetPath = type === "investor" ? `${INVESTOR_PATH_FRAGMENT}/dashboard` : `${BORROWER_PATH_FRAGMENT}/dashboard`;
        if (!location.pathname.startsWith(targetPath)) {
            navigate(targetPath, { replace: false });
        }
    }, [location.pathname, navigate, switchProfile]);

    const userType = mapProfileToUserType(activeProfile);

    return (
        <div className="min-h-screen bg-[#F5F8FE]">
            <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 pb-10">
                <Header userType={userType} onUserTypeChange={handleUserTypeChange} />
                <main className="flex-1">
                    <Outlet context={{ userType, setUserType: handleUserTypeChange }} />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;

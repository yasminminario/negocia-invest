import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Header } from "@/components/Header";

export type AppLayoutContextValue = {
    userType: "borrower" | "investor";
    setUserType: (type: "borrower" | "investor") => void;
};

const INVESTOR_PATH_FRAGMENT = "/app/investidor";
const BORROWER_PATH_FRAGMENT = "/app/tomador";

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userType, setUserType] = useState<AppLayoutContextValue["userType"]>(() =>
        location.pathname.startsWith(INVESTOR_PATH_FRAGMENT) ? "investor" : "borrower",
    );

    useEffect(() => {
        if (location.pathname.startsWith(INVESTOR_PATH_FRAGMENT)) {
            setUserType((current) => (current === "investor" ? current : "investor"));
            return;
        }

        if (location.pathname.startsWith(BORROWER_PATH_FRAGMENT)) {
            setUserType((current) => (current === "borrower" ? current : "borrower"));
        }
    }, [location.pathname]);

    const handleUserTypeChange = useCallback<AppLayoutContextValue["setUserType"]>(
        (type) => {
            setUserType(type);

            const targetPath =
                type === "investor"
                    ? `${INVESTOR_PATH_FRAGMENT}/dashboard`
                    : `${BORROWER_PATH_FRAGMENT}/dashboard`;

            if (!location.pathname.startsWith(targetPath)) {
                navigate(targetPath, { replace: false });
            }
        },
        [location.pathname, navigate],
    );

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

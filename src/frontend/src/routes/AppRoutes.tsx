import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { MainLayout } from "@/layouts/MainLayout"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { NegotiationsPage } from "@/pages/negotiations/NegotiationsPage"
import { NegotiationDetailsPage } from "@/pages/negotiations/NegotiationDetailsPage"
import { NewNegotiationPage } from "@/pages/negotiations/NewNegotiationPage"
import { CounterProposalPage } from "@/pages/negotiations/CounterProposalPage"
import { MarketPage } from "@/pages/market/MarketPage"
import { ProfilePage } from "@/pages/profile/ProfilePage"

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/negotiations" element={<NegotiationsPage />} />
                        <Route path="/negotiations/new" element={<NewNegotiationPage />} />
                        <Route path="/negotiations/:negotiationId" element={<NegotiationDetailsPage />} />
                        <Route path="/negotiations/:negotiationId/counter" element={<CounterProposalPage />} />
                        <Route path="/market" element={<MarketPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}

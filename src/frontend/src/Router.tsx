import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LoginScreen from "./pages/Auth/LoginScreen";
import ProfileSelectionScreen from "./pages/Auth/ProfileSelectionScreen";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import BorrowerActiveLoansScreen from "./pages/borrower/ActiveLoansScreen";
import AvailableOffersScreen from "./pages/borrower/AvailableOffersScreen";
import BorrowerDashboardScreen from "./pages/borrower/DashboardScreen";
import BorrowerNegotiationsListScreen from "./pages/borrower/NegotiationsListScreen";
import BorrowerOfferDetailsScreen from "./pages/borrower/OfferDetailsScreen";
import InvestorDashboardScreen from "./pages/investor/DashboardScreen";
import InvestorFundedLoansScreen from "./pages/investor/FundedLoansScreen";
import InvestorNegotiationsListScreen from "./pages/investor/NegotiationsListScreen";
import InvestorSolicitationDetailsScreen from "./pages/investor/SolicitationDetailsScreen";
import InvestorSolicitationsListScreen from "./pages/investor/SolicitationsListScreen";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/cadastro" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/app" element={<AppLayout />}>
                        <Route index element={<Navigate to="selecao-perfil" replace />} />
                        <Route path="selecao-perfil" element={<ProfileSelectionScreen />} />

                        <Route path="tomador" element={<Outlet />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<BorrowerDashboardScreen />} />
                            <Route path="ofertas" element={<AvailableOffersScreen />} />
                            <Route path="negociacoes" element={<BorrowerNegotiationsListScreen />} />
                            <Route path="emprestimos-ativos" element={<BorrowerActiveLoansScreen />} />
                            <Route path="oferta/:id" element={<BorrowerOfferDetailsScreen />} />
                        </Route>

                        <Route path="investidor" element={<Outlet />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<InvestorDashboardScreen />} />
                            <Route path="solicitacoes" element={<InvestorSolicitationsListScreen />} />
                            <Route path="negociacoes" element={<InvestorNegotiationsListScreen />} />
                            <Route path="emprestimos-concedidos" element={<InvestorFundedLoansScreen />} />
                            <Route path="solicitacao/:id" element={<InvestorSolicitationDetailsScreen />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

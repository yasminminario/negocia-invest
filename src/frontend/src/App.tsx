import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import SelectProfile from "./pages/auth/SelectProfile";
import BorrowerDashboard from "./pages/borrower/BorrowerDashboard";
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import FindOffers from "./pages/borrower/FindOffers";
import FindRequests from "./pages/investor/FindRequests";
import BorrowerLoans from "./pages/borrower/ActiveLoans";
import InvestorLoans from "./pages/investor/ActiveLoans";
import BorrowerNegotiations from "./pages/borrower/Negotiations";
import InvestorNegotiations from "./pages/investor/Negotiations";
import CreateRequest from "./pages/borrower/CreateRequest";
import CreateOffer from "./pages/investor/CreateOffer";
import { OfferDetails } from "./pages/borrower/OfferDetails";
import { RequestDetails } from "./pages/investor/RequestDetails";
import { NegotiateOffer } from "./pages/borrower/NegotiateOffer";
import { NegotiateRequest } from "./pages/investor/NegotiateRequest";
import BorrowerNegotiationDetails from "./pages/borrower/NegotiationDetails";
import InvestorNegotiationDetails from "./pages/investor/NegotiationDetails";
import BorrowerLoanDetails from "./pages/borrower/LoanDetails";
import InvestorLoanDetails from "./pages/investor/LoanDetails";
import UserProfile from "./pages/UserProfile";
import AdvanceInstallments from "./pages/investor/AdvanceInstallments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProfileProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/select-profile" element={<SelectProfile />} />

              {/* Profile Route */}
              <Route path="/profile" element={<UserProfile />} />

              {/* Borrower Routes */}
              <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
              <Route path="/borrower/find-offers" element={<FindOffers />} />
              <Route path="/borrower/loans" element={<BorrowerLoans />} />
              <Route path="/borrower/negotiations" element={<BorrowerNegotiations />} />
              <Route path="/borrower/create-request" element={<CreateRequest />} />

              {/* Investor Routes */}
              <Route path="/investor/dashboard" element={<InvestorDashboard />} />
              <Route path="/investor/find-requests" element={<FindRequests />} />
              <Route path="/investor/loans" element={<InvestorLoans />} />
              <Route path="/investor/negotiations" element={<InvestorNegotiations />} />
              <Route path="/investor/create-offer" element={<CreateOffer />} />

              {/* Detail Pages */}
              <Route path="/borrower/offer/:id" element={<OfferDetails />} />
              <Route path="/investor/request/:id" element={<RequestDetails />} />

              {/* Negotiation Pages */}
              <Route path="/borrower/negotiate/:id" element={<NegotiateOffer />} />
              <Route path="/investor/negotiate/:id" element={<NegotiateRequest />} />

              {/* Detail Pages - Negotiations */}
              <Route path="/borrower/negotiation/:id" element={<BorrowerNegotiationDetails />} />
              <Route path="/investor/negotiation/:id" element={<InvestorNegotiationDetails />} />

              {/* Detail Pages - Loans */}
              <Route path="/borrower/loan/:id" element={<BorrowerLoanDetails />} />
              <Route path="/investor/loan/:id" element={<InvestorLoanDetails />} />
              <Route path="/investor/loan/:id/advance" element={<AdvanceInstallments />} />

              {/* Demo Route (negotiation) */}
              <Route path="/demo" element={<Index />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </ProfileProvider>
  </QueryClientProvider>
);

export default App;

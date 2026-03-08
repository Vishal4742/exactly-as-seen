import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/hooks/useWallet";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import CornerTelemetry from "@/components/CornerTelemetry";
import Index from "./pages/Index";
import Register from "./pages/Register";
import AgentProfile from "./pages/AgentProfile";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";
import Agents from "./pages/Agents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <CustomCursor />
        <CornerTelemetry />
        <BrowserRouter>
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/agent/:id" element={<AgentProfile />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verify" element={<Verify />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/store/useStore";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import EscalaPage from "@/pages/EscalaPage";
import PermutasPage from "@/pages/PermutasPage";
import PermutasDiaPage from "@/pages/PermutasDiaPage";
import MilitaresPage from "@/pages/MilitaresPage";
import AlertasPage from "@/pages/AlertasPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/escala" element={<EscalaPage />} />
              <Route path="/permutas" element={<PermutasPage />} />
              <Route path="/permutas-dia" element={<PermutasDiaPage />} />
              <Route path="/militares" element={<MilitaresPage />} />
              <Route path="/alertas" element={<AlertasPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

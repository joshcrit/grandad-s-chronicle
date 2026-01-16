import { LanguageToggle } from "@/components/LanguageToggle";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import AddMemory from "./pages/AddMemory";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";
import Gallery from "./pages/Gallery";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const setScrollbarWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--scrollbar-width", `${width}px`);
    };

    setScrollbarWidth();
    window.addEventListener("resize", setScrollbarWidth);
    return () => window.removeEventListener("resize", setScrollbarWidth);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <LanguageToggle />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddMemory />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

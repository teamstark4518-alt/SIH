import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddPatient from "./pages/AddPatient";
import FHIRPreview from "./pages/FHIRPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="fhir-preview" element={<FHIRPreview />} />
            <Route path="patients" element={<div className="p-6"><h1 className="text-2xl font-bold">Patient Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Lab Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="audit" element={<div className="p-6"><h1 className="text-2xl font-bold">Audit</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="docs" element={<div className="p-6"><h1 className="text-2xl font-bold">API Documentation</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="tasks" element={<div className="p-6"><h1 className="text-2xl font-bold">Tasks</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientPage from "./pages/ClientPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDemandes from "./pages/AdminDemandes";
import AdminPlanning from "./pages/AdminPlanning";
import AdminQR from "./pages/AdminQR";
import SplashScreen from "@/components/SplashScreen";
import NotFound from "./pages/NotFound";
import { authStore } from "./store/authStore";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: JSX.Element }) =>
  authStore.isAuthed() ? children : <Navigate to="/admin/login" replace />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SplashScreen />
        <Routes>
          <Route path="/" element={<ClientPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="demandes" replace />} />
            <Route path="demandes" element={<AdminDemandes />} />
            <Route path="planning" element={<AdminPlanning />} />
            <Route path="qr" element={<AdminQR />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
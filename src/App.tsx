import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import MiddlemanDashboard from "./pages/MiddlemanDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (user?.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }
  
  return <>{children}</>;
}

// App Routes
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/dashboard/${user?.role}`} replace />
          ) : (
            <AuthPage />
          )
        }
      />
      
      <Route
        path="/dashboard/farmer"
        element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/middleman"
        element={
          <ProtectedRoute allowedRole="middleman">
            <MiddlemanDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/worker"
        element={
          <ProtectedRoute allowedRole="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/driver"
        element={
          <ProtectedRoute allowedRole="driver">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

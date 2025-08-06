import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SmartWatchProvider } from "./contexts/SmartWatchContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MobileLayout } from "./components/layout/MobileLayout";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { FullScreenLoading } from "./components/ui/loading";
import { DebugPanel } from "./components/debug/DebugPanel";
import React from "react";

// Lazy load the main pages
const Chat = React.lazy(() => import("./pages/Chat"));
const Content = React.lazy(() => import("./pages/Content"));
const Therapist = React.lazy(() => import("./pages/Therapist"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Health = React.lazy(() => import("./pages/Health"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <SmartWatchProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <MobileLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chat" element={
                    <React.Suspense fallback={<FullScreenLoading />}>
                      <Chat />
                    </React.Suspense>
                  } />
                  <Route path="/content" element={
                    <React.Suspense fallback={<FullScreenLoading />}>
                      <Content />
                    </React.Suspense>
                  } />
                  <Route path="/therapist" element={
                    <React.Suspense fallback={<FullScreenLoading />}>
                      <Therapist />
                    </React.Suspense>
                  } />
                  <Route path="/health" element={
                    <React.Suspense fallback={<FullScreenLoading />}>
                      <Health />
                    </React.Suspense>
                  } />
                  <Route path="/profile" element={
                    <React.Suspense fallback={<FullScreenLoading />}>
                      <Profile />
                    </React.Suspense>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <DebugPanel />
                </MobileLayout>
              </BrowserRouter>
            </TooltipProvider>
          </SmartWatchProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

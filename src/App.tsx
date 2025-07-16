
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SmartWatchProvider } from "./contexts/SmartWatchContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MobileLayout } from "./components/layout/MobileLayout";
import React from "react";

// Lazy load the main pages
const Chat = React.lazy(() => import("./pages/Chat"));
const Content = React.lazy(() => import("./pages/Content"));
const Therapist = React.lazy(() => import("./pages/Therapist"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Health = React.lazy(() => import("./pages/Health"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SmartWatchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={
                  <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Chat />
                  </React.Suspense>
                } />
                <Route path="/content" element={
                  <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Content />
                  </React.Suspense>
                } />
                <Route path="/therapist" element={
                  <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Therapist />
                  </React.Suspense>
                } />
                <Route path="/health" element={
                  <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Health />
                  </React.Suspense>
                } />
                <Route path="/profile" element={
                  <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Profile />
                  </React.Suspense>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          </BrowserRouter>
        </TooltipProvider>
      </SmartWatchProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

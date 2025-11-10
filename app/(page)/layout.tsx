"use client";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footers";
import Header from "@/components/Headers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex min-h-screen justify-between flex-col pt-1"
      suppressHydrationWarning
    >
      <div suppressHydrationWarning className="flex flex-col gap-2">
        <Header />
        <Toaster position="top-center" />
        <QueryClientProvider client={queryClient}>
          <main>{children}</main>
        </QueryClientProvider>
      </div>
      <Footer />
    </div>
  );
};
export default PageLayout;

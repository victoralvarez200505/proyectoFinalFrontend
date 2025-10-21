import { Suspense } from "react";
import { Outlet } from "react-router";
import Sonner from "@/components/ui/sonner";

const RootLayout = () => (
  <>
    <Sonner />
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  </>
);

export default RootLayout;

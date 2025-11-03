import { Suspense, useEffect } from "react";
import { Outlet } from "react-router";
import Sonner from "@/components/ui/Toaster/sonner";
import { aplicarTema, temaActivo } from "@/lib/tema";
import { integracionesConfig, uiConfig } from "@/config";

const RootLayout = () => {
  useEffect(() => {
    aplicarTema(temaActivo);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const { analyticsId, discordUrl, soporteUrl } = integracionesConfig;

    const body = document.body;

    if (analyticsId) {
      body.dataset.analyticsId = analyticsId;
    } else {
      delete body.dataset.analyticsId;
    }

    if (discordUrl) {
      body.dataset.discordUrl = discordUrl;
    } else {
      delete body.dataset.discordUrl;
    }

    if (soporteUrl) {
      body.dataset.soporteUrl = soporteUrl;
    } else {
      delete body.dataset.soporteUrl;
    }
  }, []);

  return (
    <>
      {uiConfig.habilitarToasts ? <Sonner /> : null}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default RootLayout;

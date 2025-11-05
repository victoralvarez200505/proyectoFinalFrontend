import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Inicio from "@/pages/Inicio";
import Genero from "@/pages/Genero.tsx";
import Resenias from "@/pages/Resenias.tsx";
import PaginaNoEncontrada from "@/pages/NotFound";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
      {
        path: "genero/:genero",
        element: <Genero />,
      },
      {
        path: "resenias/:id",
        element: <Resenias />,
      },
      { path: "*", element: <PaginaNoEncontrada /> },
    ],
  },
], {
  basename: "/proyectoFinalFrontend",
});

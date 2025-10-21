import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Inicio from "@/pages/Inicio";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
    ],
  },
]);

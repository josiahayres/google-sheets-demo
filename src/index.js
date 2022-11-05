import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";
import AlreadyComplete from "./routes/AlreadyComplete";
import CurrentUser from "./routes/CurrentUser";
import ErrorPage from "./ErrorPage";
import Root from "./routes/Root";
import Question from "./routes/Question";
import Validate from "./routes/Validate";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Validate />,
        errorElement: <div>Oops! There was an error.</div>,
      },
      {
        path: "already-complete",
        element: <AlreadyComplete />,
      },
      {
        path: "user/:code",
        element: <CurrentUser />,
        children: [
          {
            path: "confirm",
            element: <p>Confirm today's answers</p>,
          },
          {
            path: ":questionId",
            element: <Question />,
          },
        ],
      },
    ],
  },
]);
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

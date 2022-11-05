import React from "react";
import ReactDOM from "react-dom/client";

import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/Root";
import ErrorPage from "./ErrorPage";

import "./index.css";
import Validate, {
  loader as validateLoader,
  action as validateAction,
} from "./routes/Validate";
import CurrentUser from "./routes/CurrentUser";
import Question from "./routes/Question";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlreadyComplete from "./routes/AlreadyComplete";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Validate />,
            loader: validateLoader,
            action: validateAction,
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
                path: ":questionId",
                element: <Question />,
              },
            ],
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

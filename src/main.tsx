import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// import { toast } from "./hooks/use-toast.ts";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, retryDelay: 1000 } },
  queryCache: new QueryCache({
    onError: () => {
      // toast({
      //   title: "Error",
      //   description: error.message,
      // });
    },
  }),
});

queryClient.invalidateQueries({ queryKey: ["users","user", "register","teams","ownedTeams"] });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="none"/>
    </QueryClientProvider>

  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/index.jsx";
import { RegulatorProvider } from "./context/RegulatorContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 30000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RegulatorProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <App />
        </QueryClientProvider>
      </RegulatorProvider>
    </UserProvider>
  </React.StrictMode>
);

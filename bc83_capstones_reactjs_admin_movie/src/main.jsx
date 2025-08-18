import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const newQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <QueryClientProvider client={newQueryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);

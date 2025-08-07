import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { persistor, store } from "./store";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer position="top-center" />
          <QueryClientProvider client={queryClient}>
            <AppRoutes />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
};

export default App;

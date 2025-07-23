import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import AppRoutes from "./routes/AppRoutes";
import { persistor, store } from "./store";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer position="top-center" />
          <AppRoutes />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;

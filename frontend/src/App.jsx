import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { LoadingProvider } from "./contexts/LoadingContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <LoadingProvider>
        <ToastContainer />
        <AppRoutes />
      </LoadingProvider>
    </>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
// import store from '@/app/store';
import { Toaster } from "./components/ui/sonner";
import appStore from "@/app/store";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/LoadingSpinner";
import "./utils/envCheck"; // Check environment variables on startup

import PropTypes from "prop-types";

const Custom = ({ children }) => {
  const token = localStorage.getItem("token");
  // Only fetch user if a token exists
  const { isLoading } = useLoadUserQuery(undefined, { skip: !token });
  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};

Custom.propTypes = {
  children: PropTypes.node.isRequired,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>,
);

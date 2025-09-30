import { createContext, useState, useCallback } from "react";
export const AlertContext = createContext();
export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const showAlert = useCallback((message, type = "info") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert(a => ({ ...a, visible: false })), 3000);
  }, []);
  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
    {children}
    </AlertContext.Provider>
);
}
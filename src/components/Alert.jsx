import ReactDOM from "react-dom";
import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

export default function Alert() {
  const { alert } = useContext(AlertContext);

  if (!alert.visible) return null;

  const styles = {
    success: "bg-green-50 border-green-500 text-green-700",
    error: "bg-red-50 border-red-500 text-red-700",
    info: "bg-blue-50 border-blue-500 text-blue-700",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
  };

  const icons = {
    success: <i className="bi bi-check-circle-fill text-green-500 text-lg"></i>,
    error: <i className="bi bi-exclamation-triangle-fill text-red-500 text-lg"></i>,
    info: <i className="bi bi-info-circle-fill text-blue-500 text-lg"></i>,
    warning: <i className="bi bi-exclamation-circle-fill text-yellow-500 text-lg"></i>,
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md transition-all duration-500 ease-out opacity-100 translate-y-0 ${styles[alert.type || "info"]}`}
    >
      {icons[alert.type || "info"]}
      <span className="text-sm font-medium">{alert.message}</span>
    </div>,
    document.body
  );
}

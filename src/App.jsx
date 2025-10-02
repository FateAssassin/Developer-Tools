import { useState } from "react"
import EmbedBuilder from "./tabs/embed-builder"
import TextToString from "./tabs/text-to-string";
import Footer from "./components/footer";
import "bootstrap-icons/font/bootstrap-icons.css";
import Alert from "./components/Alert";

function App() {
  const [activeTab, setActiveTab] = useState("embed-builder");

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      <Alert />
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="pt-4 pb-4">
          <h1 className="text-center text-blue-500 dark:text-blue-300 font-semibold text-3xl">
            Fate's Developer Tools
          </h1>
          <p className="text-center mt-4 text-blue-400 dark:text-blue-200">
            Your one-stop solution for your Jishaku needs.
          </p>
          <div className="border border-gray-300 dark:border-gray-700 shadow-2xl rounded-sm mt-4">
            <div className="flex border-b border-blue-100 dark:border-blue-900">
              <button
                className={`flex-1 cursor-pointer px-6 py-4 text-center font-medium text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  activeTab === "embed-builder"
                    ? "border-b-4 border-blue-500 dark:border-blue-400"
                    : "border-b-4 border-b-gray-200 dark:border-b-gray-800"
                }`}
                data-tab="embed-builder"
                onClick={() => setActiveTab("embed-builder")}
              >
                <i className="bi bi-code-slash mr-2"></i> Discord Embed Builder
              </button>
              <button
                className={`flex-1 cursor-pointer px-6 py-4 text-center font-medium text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  activeTab === "text-converter"
                    ? "border-b-4 border-blue-500 dark:border-blue-400"
                    : "border-b-4 border-b-gray-200 dark:border-b-gray-800"
                }`}
                data-tab="text-converter"
                onClick={() => setActiveTab("text-converter")}
              >
                <i className="bi bi-card-text mr-2"></i> Text to Python String
              </button>
            </div>
            <div className="p-4">
              {activeTab === "embed-builder" && <EmbedBuilder />}
              {activeTab === "text-converter" && <TextToString />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  )
}

export default App
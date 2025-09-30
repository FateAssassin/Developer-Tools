import { useState } from "react";

export default function TextToString() {
    const [outputText, setOutputText] = useState("");
    const [variable, setVariable] = useState("");
    const [copy, setCopy] = useState(false);

    function copyToClipboard() {
      if (variable !== "") {
        navigator.clipboard.writeText(`${variable} = ${outputText}`);
      } else {
        navigator.clipboard.writeText(outputText);
      }
      setCopy(true);
      setTimeout(() => setCopy(false), 2000);
    }

    function changeOutput(inputText) {
        // Escape backslashes and double quotes, then replace newlines with \n
        const escapedText = inputText
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\r?\n/g, "\\n");
        setOutputText(`"${escapedText}"`);
    }

  return (
    <div>
      <h2 className="text-2xl text-blue-500 dark:text-blue-300 font-semibold mb-2">Text to Python String Converter</h2>
      <p className="text-blue-400 dark:text-blue-200 mb-4">Convert your text with multiple lines into a properly escaped Python string.</p>
      <input type="text" value={variable} onChange={(e) => setVariable(e.target.value)} placeholder="Variable Name (optional)" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        rows="4"
        placeholder="Paste your text here..."
        onChange={(e) => changeOutput(e.target.value)}
      />
      <div className="flex justify-center items-center mt-4 gap-4">
        <div
          className="
            overflow-x-auto
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar]:rounded-b-sm
            [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
            [&::-webkit-scrollbar-track]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-800
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-gray-600
            max-w-140
            md:min-w-140
          "
        >
          <h3 className="text-lg font-semibold dark:text-gray-100">Converted Output:</h3>
          {(outputText && (
            <pre
              className="bg-gray-100 dark:bg-gray-800 p-2 border dark:text-white border-gray-300 dark:border-gray-700 rounded-t-md [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:rounded-b-sm [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-800"
              style={{ width: "100%", overflowX: "scroll"}}
            >
              {variable &&  <span>{variable} = </span>}
              {outputText}
            </pre>
          ))}
          {(!outputText && (
            <pre
              className="bg-gray-100 dark:bg-gray-800 p-2 border dark:text-white border-gray-300 dark:border-gray-700 rounded-t-md [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:rounded-b-sm [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-800"
              style={{ width: "100%", overflowX: "scroll"}}
            >
              {variable && <span>{variable} = </span>}
              <span>""</span>
            </pre>
          ))}
        </div>
        <button className={`flex-shrink-0 mt-6 border dark:text-white ${!copy ? "bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-900 hover:bg-blue-200 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-700" : "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-900 hover:bg-green-200 dark:hover:bg-green-800 hover:border-green-300 dark:hover:border-green-700"} duration-100 p-2 cursor-pointer rounded-lg`} onClick={copyToClipboard}>
          <i className={`${!copy ? "bi bi-clipboard" : "bi bi-check"}`}></i>
        </button>
      </div>
    </div>
  );
}
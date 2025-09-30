import { useState, useRef, useEffect } from "react";

function AnimatedDetails({ summary, children }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      const scrollHeight = ref.current.scrollHeight;
      setHeight(scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="border mb-2 border-gray-300 dark:border-gray-700 rounded-sm">
      <div
        className="cursor-pointer dark:text-white px-2 py-1 select-none"
        onClick={() => setOpen(!open)}
      >
        {summary}
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </div>
      <div
        ref={ref}
        style={{
          maxHeight: height,
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
export default AnimatedDetails;
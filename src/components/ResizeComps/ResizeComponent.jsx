import { useEffect, useState } from "react";
const getSnapLabel = (percentage) => {
  const rounded = Math.round(percentage * 10) / 10;
  if (Math.abs(rounded - 25) < 0.5) return "1/4";
  if (Math.abs(rounded - 50) < 0.5) return "1/2";
  if (Math.abs(rounded - 75) < 0.5) return "3/4";
  return null;
};
const ResizeComponent = ({
  onResize,
  onResizeEnd,
  currentPercentage,
  horizontal,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [snapLabel, setSnapLabel] = useState(null);

  useEffect(() => {
    const handleMouseMove_Horizontal = (e) => {
      if (isDragging) {
        if (horizontal) {
          onResize(e.clientY);
        }
        onResize(e.clientX);
      }
    };

    const handleMouseUp_Horizontal = () => {
      setIsDragging(false);

      if (onResizeEnd) {
        const finalPercentage = onResizeEnd();
        const label = getSnapLabel(finalPercentage);
        if (label) {
          setSnapLabel(label);
        }
      }

      setTimeout(() => {
        setIsVisible(false);
      }, 800);

      setTimeout(() => {
        setShowPercentage(false);
        setSnapLabel(null);
      }, 1000);
    };

    if (isDragging) {
      setShowPercentage(true);
      setIsVisible(true);
      setSnapLabel(null);
      document.addEventListener("mousemove", handleMouseMove_Horizontal);
      document.addEventListener("mouseup", handleMouseUp_Horizontal);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove_Horizontal);
      document.removeEventListener("mouseup", handleMouseUp_Horizontal);
    };
  }, [isDragging, onResize, onResizeEnd, horizontal]);

  return (
    <>
      {horizontal ? (
        <div
          className="relative h-2 bg-gray-600 hover:bg-red-500 cursor-row-resize flex-shrink-0 transition-colors"
          onMouseDown={() => setIsDragging(true)}
        >
          {showPercentage && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap z-10 shadow-lg transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {snapLabel || `${currentPercentage.toFixed(1)}%`}
            </div>
          )}
        </div>
      ) : (
        <div
          className="relative w-2 bg-gray-600 hover:bg-red-500 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={() => setIsDragging(true)}
        >
          {showPercentage && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap z-10 shadow-lg transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {snapLabel || `${currentPercentage.toFixed(1)}%`}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ResizeComponent;

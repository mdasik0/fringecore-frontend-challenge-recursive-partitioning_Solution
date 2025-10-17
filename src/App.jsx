import { useEffect, useRef, useState } from "react";
import { colors } from "./lib/colors/colors";

const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const getSnapLabel = (percentage) => {
  const rounded = Math.round(percentage * 10) / 10;
  if (Math.abs(rounded - 25) < 0.5) return "1/4";
  if (Math.abs(rounded - 50) < 0.5) return "1/2";
  if (Math.abs(rounded - 75) < 0.5) return "3/4";
  return null;
};

const ResizeComponent_V = ({ onResize, onResizeEnd, currentPercentage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [snapLabel, setSnapLabel] = useState(null);

  useEffect(() => {
    const handleMouseMove_Vertical = (e) => {
      if (isDragging) {
        onResize(e.clientX);
      }
    };

    const handleMouseUp_Vertical = () => {
      setIsDragging(false);

      if (onResizeEnd) {
        const finalPercentage = onResizeEnd();
        const label = getSnapLabel(finalPercentage);
        console.log(finalPercentage)
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
      document.addEventListener("mousemove", handleMouseMove_Vertical);
      document.addEventListener("mouseup", handleMouseUp_Vertical);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove_Vertical);
      document.removeEventListener("mouseup", handleMouseUp_Vertical);
    };
  }, [isDragging, onResize, onResizeEnd]);
console.log(snapLabel)
  return (
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
          {/* {currentPercentage == 25 ? '1/4': currentPercentage == 50 ? '1/2' : currentPercentage == 75 ? '3/4' : `${currentPercentage.toFixed(1)}%`} */}
          {currentPercentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

const ResizeComponent_H = ({ onResize, onResizeEnd, currentPercentage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [snapLabel, setSnapLabel] = useState(null);

  useEffect(() => {
    const handleMouseMove_Horizontal = (e) => {
      if (isDragging) {
        onResize(e.clientY);
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
  }, [isDragging, onResize, onResizeEnd]);

  return (
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
  );
};

const DivBox = ({ id, depth, bgColor, onDelete }) => {
  const [hasSplit_Vertically, setHasSplit_Vertically] = useState(false);
  const [hasSplit_Horizontally, setHasSplit_Horizontally] = useState(false);
  const [children, setChildren] = useState([]);
  const [leftWidth, setLeftWidth] = useState(50);
  const [topHeight, setTopHeight] = useState(50);
  const containerRef = useRef();

  const handleSplit_Vertically = () => {
    const newChildrenDivs = [
      { id: `${id}-left`, color: bgColor },
      { id: `${id}-right`, color: generateRandomColor() },
    ];

    if (!hasSplit_Vertically) {
      setChildren(newChildrenDivs);
      setHasSplit_Vertically(true);
      setLeftWidth(50);
    }
  };

  const handleSplit_Horizontally = () => {
    const newChildrenDivs = [
      { id: `${id}-top`, color: bgColor },
      { id: `${id}-bottom`, color: generateRandomColor() },
    ];

    if (!hasSplit_Horizontally) {
      setChildren(newChildrenDivs);
      setHasSplit_Horizontally(true);
      setTopHeight(50);
    }
  };

  const handleSplit_Delete = (childId) => {
    setChildren((prevChildren) => {
      const updatedChildren = prevChildren.filter((c) => c.id !== childId);
      return updatedChildren;
    });
  };

  const snapToGrid = (value) => {
    const snapPoints = [25, 33.33, 50, 66.67, 75];
    const threshold = 5;

    
    for (const point of snapPoints) {
      if (Math.abs(value - point) < threshold) {
        console.log(value, point)
        return point;
      }
    }
    return value;
  };

  const handleResize_Vertically = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(10, Math.min(90, newLeftWidth)));
    }
  };

  const handleResizeEnd_Vertically = () => {
    setLeftWidth((prevWidth) => snapToGrid(prevWidth));
    
  };

  const handleResize_Horizontally = (clientY) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newTopHeight = ((clientY - rect.top) / rect.height) * 100;
      setTopHeight(Math.max(10, Math.min(90, newTopHeight)));
    }
  };

  const handleResizeEnd_Horizontally = () => {
    setTopHeight((prevHeight) => snapToGrid(prevHeight));
  };

  if (hasSplit_Vertically) {
    return (
      <div ref={containerRef} className="flex w-full h-full">
        {children[0] && (
          <div
            style={{ width: children.length === 1 ? "100%" : `${leftWidth}%` }}
            className="h-full"
          >
            <DivBox
              key={children[0].id}
              id={children[0].id}
              depth={depth + 2}
              bgColor={children[0].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[0].id)
                  : onDelete
              }
            />
          </div>
        )}
        {children.length === 2 && (
          <ResizeComponent_V
            onResize={handleResize_Vertically}
            onResizeEnd={handleResizeEnd_Vertically}
            currentPercentage={leftWidth}
          />
        )}
        {children[1] && (
          <div
            style={{
              width: children.length === 1 ? "100%" : `${100 - leftWidth}%`,
            }}
            className="h-full"
          >
            <DivBox
              key={children[1].id}
              id={children[1].id}
              depth={depth + 2}
              bgColor={children[1].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[1].id)
                  : onDelete
              }
            />
          </div>
        )}
      </div>
    );
  }

  if (hasSplit_Horizontally) {
    return (
      <div ref={containerRef} className="flex flex-col w-full h-full">
        {children[0] && (
          <div
            style={{ height: children.length === 1 ? "100%" : `${topHeight}%` }}
            className="w-full"
          >
            <DivBox
              key={children[0].id}
              id={children[0].id}
              depth={depth + 2}
              bgColor={children[0].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[0].id)
                  : onDelete
              }
            />
          </div>
        )}
        {children.length === 2 && (
          <ResizeComponent_H
            onResize={handleResize_Horizontally}
            onResizeEnd={handleResizeEnd_Horizontally}
            currentPercentage={topHeight}
          />
        )}
        {children[1] && (
          <div
            style={{
              height: children.length === 1 ? "100%" : `${100 - topHeight}%`,
            }}
            className="w-full"
          >
            <DivBox
              key={children[1].id}
              id={children[1].id}
              depth={depth + 2}
              bgColor={children[1].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[1].id)
                  : onDelete
              }
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${bgColor} w-full h-full flex items-center justify-center`}
    >
      <div className="buttons flex font-semibold items-center ">
        <button
          onClick={handleSplit_Vertically}
          className="bg-white hover:bg-gray-200 duration-300 w-8 h-8 flex items-center justify-center border-2 border-gray-400 -mr-1 uppercase"
        >
          v
        </button>
        <button
          onClick={handleSplit_Horizontally}
          className="bg-white hover:bg-gray-200 duration-300 w-9 h-8 flex items-center justify-center border-2 border-gray-400 uppercase"
        >
          h
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-white hover:bg-gray-200 duration-300 w-8 h-8 flex items-center justify-center border-2 border-gray-400 -ml-1 text-xl uppercase"
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="w-screen h-screen">
      <DivBox id="root" bgColor={"bg-blue-500"} />
    </div>
  );
}

export default App;

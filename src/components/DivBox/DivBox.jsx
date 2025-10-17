import { useRef, useState } from "react";
import { colors } from "../../lib/colors/colors";
import ResizeComponent_H from "../ResizeComps/ResizeComponent_H";
import ResizeComponent_V from "../ResizeComps/ResizeComponent_V";

const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
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
    const snapPoints = [25, 50, 75];
    const threshold = 5;

    for (const point of snapPoints) {
      if (Math.abs(value - point) < threshold) {
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
    const snappedWidth = snapToGrid(leftWidth);
    setLeftWidth(snappedWidth);
    return snappedWidth;
  };

  const handleResize_Horizontally = (clientY) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newTopHeight = ((clientY - rect.top) / rect.height) * 100;
      setTopHeight(Math.max(10, Math.min(90, newTopHeight)));
    }
  };

  const handleResizeEnd_Horizontally = () => {
    const snappedHeight = snapToGrid(topHeight);
    setTopHeight(snappedHeight);
    return snappedHeight;
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

export default DivBox;

import { useState } from "react";
import { colors } from "./lib/colors/colors";

const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const DivBox = ({ id, depth, bgColor, onDelete }) => {
  const [hasSplit_Vertically, setHasSplit_Vertically] = useState(false);
  const [hasSplit_Horizontally, setHasSplit_Horizontally] = useState(false);
  const [children, setChildren] = useState([]);
  const handleSplit_Vertically = () => {
    const newChildrenDivs = [
      { id: `${id}-left`, color: bgColor },
      { id: `${id}-right`, color: generateRandomColor() },
    ];

    if (!hasSplit_Vertically) {
      setChildren(newChildrenDivs);
      setHasSplit_Vertically(true);
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
    }
  };
  const handleSplit_Delete = (childId) => {
    const updatedChildren = children.filter((c) => c.id !== childId);
    setChildren(updatedChildren);
  };
  if (hasSplit_Vertically) {
    return (
      <div className="flex gap-2 w-full h-full">
        {children.map((child) => (
          <DivBox
            key={child.id}
            id={child.id}
            depth={depth + 2}
            bgColor={child.color}
            onDelete={() => handleSplit_Delete(child.id)}
          />
        ))}
      </div>
    );
  }
  if (hasSplit_Horizontally) {
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        {children.map((child) => (
          <DivBox
            key={child.id}
            id={child.id}
            depth={depth + 2}
            bgColor={child.color}
            onDelete={() => handleSplit_Delete(child.id)}
          />
        ))}
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
            onClick={onDelete}
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

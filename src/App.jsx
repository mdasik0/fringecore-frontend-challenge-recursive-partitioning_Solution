import { useState } from "react";

const DivBox = ({ id, deapth }) => {
  const [hasSplitVertically, setHasSplitVertically] = useState(false);
  const [children, setChildren] = useState([]);
  const handleSplitVertically = () => {
    const newChildrenDivs = [`${id}-left`, `${id}-right`];

    if (!hasSplitVertically) {
      setChildren(newChildrenDivs);
      setHasSplitVertically(true);
    }
  };
  if(hasSplitVertically){
    return <div className="flex gap-2 w-full h-full">
    {
      children.map((childId) => <DivBox key={childId} id={childId} deapth={deapth+2} />)
    }
    </div>
  }

  return (
    <div className="w-full h-full bg-blue-500 flex items-center justify-center">
      <div className="buttons flex font-semibold items-center border-2 border-gray-400">
        <button
          onClick={handleSplitVertically}
          className="bg-white hover:bg-gray-200 duration-300 w-8 h-8 flex items-center justify-center  uppercase"
        >
          v
        </button>
        <button className="bg-white hover:bg-gray-200 duration-300 w-9 h-8 flex items-center justify-center border-l-2 border-r-2 border-gray-400 uppercase">
          h
        </button>
        <button className="bg-white hover:bg-gray-200 duration-300 w-8 h-8 flex items-center justify-center text-xl uppercase">
          -
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="w-screen h-screen">
      <DivBox id="root" />
    </div>
  );
}

export default App;

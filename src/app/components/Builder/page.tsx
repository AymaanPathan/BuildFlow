"use client";
import React from "react";

interface ElementType {
  id: string;
  name: string;
  children: ElementType[];
}

function Builder() {
  const [items] = React.useState(["Text", "Container", "Heading"]);
  const [elements, setElements] = React.useState<ElementType[]>([]);
  const [draggableItems, setDraggableItems] = React.useState<{
    element: ElementType | null;
    parentPath: string[];
  }>({ element: null, parentPath: [] });

  const generateId = Date.now().toString(36);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    content: string,
    parentPath: string[] = []
  ) => {
    const element: ElementType = {
      id: generateId,
      name: content,
      children: [],
    };
    setDraggableItems({ element: element, parentPath });
    e?.dataTransfer?.setData("text", JSON.stringify(element));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50", "border-indigo-500");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-gray-700/50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-gray-700/50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggableItems.element) {
      setElements([...elements, draggableItems.element]);
      setDraggableItems({ element: null, parentPath: [] });
    }
  };

  // Add Element To Container [ adds a new element inside a container]
  //  handleContainerDrop  [droping element inside a container]
  //  render Element [Recursive function to render elements and their children]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-screen gap-4 p-4">
        {/* Left Sidebar */}
        <div className="flex w-72 flex-col gap-4 rounded-xl bg-gray-800 p-4 shadow-xl">
          <h2 className="text-xl font-bold text-indigo-400">Components</h2>
          <div className="flex flex-col gap-3">
            {items.map((data, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, data)}
                // onDragEnd={handleDragEnd}
                className="cursor-move rounded-lg border-2 border-gray-700 bg-gray-700/50 p-3 transition-all hover:border-indigo-500 hover:bg-gray-700/80 active:scale-95"
              >
                <span className="text-gray-300">{data}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
          onDragLeave={handleDragLeave}
          className="flex-1 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 p-6 transition-colors"
        >
          <h3 className="mb-6 text-lg font-semibold text-indigo-400">Canvas</h3>
          {elements.map((element, index) => {
            const isContainer = element.name === "Container";

            return (
              <div
                key={index}
                className={`group border p-2 mb-4 shadow-lg ${
                  isContainer
                    ? "mb-4 bg-gray-700/50 h-24 p-6 border-2 border-gray-500"
                    : ""
                } hover:border-indigo-200 relative`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none z-50">
                  <div className="relative">
                    <div className="bg-gray-800 text-gray-100 text-xs font-medium px-3 py-2 rounded-lg shadow-xl flex items-center space-x-2 transform transition-all delay-150 duration-300 opacity-0 group-hover:opacity-100">
                      <span>
                        {isContainer ? "Container" : `${element.name}`}
                      </span>
                      <span className="text-indigo-400">•</span>
                      <span className="text-gray-400">
                        {isContainer
                          ? "Accepts nested elements"
                          : "Drag to reposition"}
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
                  </div>
                </div>
                <span>{element.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Builder;

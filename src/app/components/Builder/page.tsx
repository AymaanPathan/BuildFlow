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
  const [hoveredElement, setHoveredElement] = React.useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    content: string,
    parentPath: string[] = []
  ) => {
    const element: ElementType = {
      id: generateId(),
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
  const hanldeAddElementToContainer = (
    elements: ElementType[],
    containerId: string,
    newElement: ElementType
  ): ElementType[] => {
    return elements.map((element: ElementType) => {
      if (element.id === containerId) {
        return { ...element, children: [...element.children, newElement] };
      } else if (element.children) {
        return {
          ...element,
          children: hanldeAddElementToContainer(
            element.children,
            containerId,
            newElement
          ),
        };
      }
      return element;
    });
  };
  console.log(hoveredElement);
  //  handleContainerDrop  [droping element inside a container]
  const handleDropInContainer = (
    e: React.DragEvent<HTMLDivElement>,
    containerId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggableItems.element) {
      setElements((prevElement) =>
        hanldeAddElementToContainer(
          prevElement,
          containerId,
          draggableItems.element!
        )
      );
    }
    setDraggableItems({ element: null, parentPath: [] });
  };
  //  render Element [Recursive function to render elements and their children]\

  const renderElement = (element: ElementType) => {
    const isContainer = element.name === "Container";
    return (
      <div
        key={element.id}
        onMouseEnter={(e) => {
          setHoveredElement({
            name: element.name,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseLeave={() => setHoveredElement(null)}
        onDragOver={isContainer ? handleDragOver : undefined}
        onDragLeave={isContainer ? handleDragLeave : undefined}
        onDrop={
          isContainer ? (e) => handleDropInContainer(e, element.id) : undefined
        }
        className={`group border p-2 mb-4 shadow-lg hover:border-indigo-200 relative ${
          isContainer
            ? "bg-gray-700/50 h-auto p-6 border-2 border-gray-500"
            : ""
        }`}
      >
        <span>{element.name !== "Container" && element.name}</span>
        {element.children.length > 0 && (
          <div className="ml-4 mt-2">
            {element.children.map((child) => renderElement(child))}
          </div>
        )}
      </div>
    );
  };

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
                className="cursor-move rounded-lg border-2 border-gray-700 bg-gray-700/50 p-3 transition-all hover:border-indigo-500 hover:bg-gray-700/80 active:scale-95"
              >
                <span className="text-gray-300">{data}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
          onDragLeave={handleDragLeave}
          className="flex-1 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 p-6 transition-colors relative"
        >
          <h3 className="mb-6 text-lg font-semibold text-indigo-400">Canvas</h3>
          {elements.map((element) => renderElement(element))}

          {/* Modern Tooltip */}
          {hoveredElement && !draggableItems.element && (
            <div
              className="fixed z-50 min-w-[100px] rounded-lg bg-gray-800 px-3 py-2 text-sm text-white shadow-lg transition-opacity duration-200 border border-gray-600 backdrop-blur-sm"
              style={{
                left: `${hoveredElement.x + 15}px`,
                top: `${hoveredElement.y + 15}px`,
              }}
            >
              <div className="relative">{hoveredElement.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Builder;

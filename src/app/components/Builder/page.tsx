"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import ElementProperty from "./ElementProperty";

interface ElementType {
  id: string;
  name: string;
  content?: string;
  style?: React.CSSProperties;
  children: ElementType[];
  // Optional custom property to store the user-defined height
  customHeight?: string;
}

function Builder() {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const renderPreviewElement = (element: ElementType) => {
    const isContainer = element.name === "Container";
    const isTextElement = element.name === "Text" || element.name === "Heading";

    return (
      <div
        key={element.id}
        style={element.style}
        className={`${isContainer ? "min-h-[7rem]" : ""} mb-4`}
      >
        {isTextElement && (
          <div className="w-full">
            <span className="text-gray-800">{element.content}</span>
          </div>
        )}
        {element.children.length > 0 && (
          <div>
            {element.children.map((child) => renderPreviewElement(child))}
          </div>
        )}
      </div>
    );
  };

  const [items] = useState(["Text", "Container", "Heading"]);
  const [elements, setElements] = useState<ElementType[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  // State for the "Fit Content" checkbox (applies to Container elements)
  const [containerFit, setContainerFit] = useState(false);

  const [draggableItems, setDraggableItems] = useState<{
    element: ElementType | null;
    parentPath: string[];
  }>({ element: null, parentPath: [] });
  const [hoveredElement, setHoveredElement] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  const handleDragStart = (
    e: React.DragEvent<HTMLElement>,
    content: string,
    parentPath: string[] = []
  ) => {
    const element: ElementType = {
      id: generateId(),
      name: content,
      children: [],
    };
    if (content === "Text" || content === "Heading") {
      element.content = content === "Text" ? "Your Text Here" : "New Heading";
    }
    setDraggableItems({ element: element, parentPath });
    e.dataTransfer?.setData("text", JSON.stringify(element));
  };

  const updateElementContent = (
    elements: ElementType[],
    elementId: string,
    newContent: string
  ): ElementType[] => {
    return elements.map((element) => {
      if (element.id === elementId) {
        return { ...element, content: newContent };
      }
      if (element.children.length > 0) {
        return {
          ...element,
          children: updateElementContent(
            element.children,
            elementId,
            newContent
          ),
        };
      }
      return element;
    });
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

  // Recursively update the style for the element with the given id.
  const updateElementStyleRecursively = (
    elems: ElementType[],
    elementId: string,
    styleName: keyof React.CSSProperties,
    styleVal: string | number
  ): ElementType[] => {
    return elems.map((el) => {
      if (el.id === elementId) {
        let newStyleVal = styleVal;
        if (styleName === "height" && typeof styleVal === "number") {
          newStyleVal = `${styleVal}px`;
        }
        return { ...el, style: { ...el.style, [styleName]: newStyleVal } };
      }
      if (el.children && el.children.length > 0) {
        return {
          ...el,
          children: updateElementStyleRecursively(
            el.children,
            elementId,
            styleName,
            styleVal
          ),
        };
      }
      return el;
    });
  };

  // Update container (and its children) with "fit-content" style.
  // When unchecking, revert to user styling if available.
  const updateContainerFitContent = (
    elems: ElementType[],
    containerId: string,
    fitContent: boolean
  ): ElementType[] => {
    return elems.map((el) => {
      if (el.id === containerId && el.name === "Container") {
        const newStyle = { ...el.style };
        if (fitContent) {
          // Store the current height as customHeight if not already stored
          if (
            !el.customHeight &&
            newStyle.height &&
            newStyle.height !== "fit-content"
          ) {
            el.customHeight = newStyle.height as string;
          }
          newStyle.height = "fit-content";
        } else {
          // Revert back to stored customHeight if available, or remove height styling
          newStyle.height = el.customHeight || undefined;
          delete el.customHeight;
        }

        // Update immediate children as well
        const newChildren = el.children.map((child) => ({
          ...child,
          style: {
            ...child.style,
            height: fitContent ? "fit-content" : child.style?.height,
          },
        }));

        return { ...el, style: newStyle, children: newChildren };
      }
      if (el.children && el.children.length > 0) {
        return {
          ...el,
          children: updateContainerFitContent(
            el.children,
            containerId,
            fitContent
          ),
        };
      }
      return el;
    });
  };

  const handleHeightChange = (newHeight: number) => {
    if (!selectedElementId) return;
    setElements((prevElements) =>
      updateElementStyleRecursively(
        prevElements,
        selectedElementId,
        "height",
        newHeight
      )
    );
  };

  const handleAddElementToContainer = (
    elems: ElementType[],
    containerId: string,
    newElement: ElementType
  ): ElementType[] => {
    return elems.map((el: ElementType) => {
      if (el.id === containerId) {
        return { ...el, children: [...el.children, newElement] };
      } else if (el.children) {
        return {
          ...el,
          children: handleAddElementToContainer(
            el.children,
            containerId,
            newElement
          ),
        };
      }
      return el;
    });
  };

  // Handle dropping an element inside a container
  const handleDropInContainer = (
    e: React.DragEvent<HTMLDivElement>,
    containerId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggableItems.element) {
      setElements((prevElements) =>
        handleAddElementToContainer(
          prevElements,
          containerId,
          draggableItems.element!
        )
      );
    }
    setDraggableItems({ element: null, parentPath: [] });
  };

  const renderElement = (element: ElementType) => {
    const isContainer = element.name === "Container";
    const isTextElement = element.name === "Text" || element.name === "Heading";

    return (
      <div
        key={element.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElementId(element.id);
          // If a container is selected, update the checkbox state based on its style.
          if (element.name === "Container") {
            setContainerFit(element.style?.height === "fit-content");
          } else {
            setContainerFit(false);
          }
        }}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHoveredElement({
            name: element.name,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
          });
        }}
        onMouseLeave={() => setHoveredElement(null)}
        onDragOver={isContainer ? handleDragOver : undefined}
        onDragLeave={isContainer ? handleDragLeave : undefined}
        onDrop={
          isContainer ? (e) => handleDropInContainer(e, element.id) : undefined
        }
        className={`group border p-2 mb-4 transition-all hover:border-indigo-400 relative 
          ${selectedElementId === element.id ? "border-yellow-500" : ""}
          ${
            isContainer
              ? "bg-gray-800/80 hover:bg-gray-800 border-2 min-h-28 border-gray-600 "
              : "bg-gray-900 border-gray-700 hover:bg-gray-800"
          }`}
        style={element.style}
      >
        {isTextElement && (
          <div className="w-full">
            {selectedElementId === element.id ? (
              <input
                type="text"
                value={element.content || ""}
                onChange={(e) => {
                  setElements((prev) =>
                    updateElementContent(prev, element.id, e.target.value)
                  );
                }}
                className="w-full bg-transparent text-white outline-none"
                autoFocus
                // Optionally, adjust onBlur if needed
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-gray-300">
                {element.content || element.name}
              </span>
            )}
          </div>
        )}
        {element.children.length > 0 && (
          <div>{element.children.map((child) => renderElement(child))}</div>
        )}
        <Tooltip>
          <TooltipTrigger className="absolute -top-3 -left-1.5">
            <span className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-gray-800 border-gray-700 text-gray-200 rounded-md px-2 py-1 text-sm shadow-lg transition-opacity duration-150"
          >
            {element.name}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  // Determine if the currently selected element is a container
  const selectedElementIsContainer = React.useMemo(() => {
    if (!selectedElementId) return false;
    const findElement = (elems: ElementType[]): ElementType | null => {
      for (const el of elems) {
        if (el.id === selectedElementId) return el;
        if (el.children.length > 0) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    const selectedEl = findElement(elements);
    return selectedEl?.name === "Container";
  }, [selectedElementId, elements]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gray-950">
        <div className="flex h-screen gap-4 p-4">
          {/* Main Canvas */}
          <Card
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e)}
            onDragLeave={handleDragLeave}
            className="flex-1 relative bg-gray-900 border-2 border-dashed border-gray-800 min-w-0"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-200">Canvas</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewing(true)}
                className="text-gray-400 hover:text-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {elements.map((element) => renderElement(element))}
            </CardContent>
          </Card>
          {/* Right Sidebar */}
          <ElementProperty
            onDragStart={handleDragStart}
            items={items}
            handleDragStart={handleDragStart}
            selectedElementId={selectedElementId}
            selectedElementIsContainer={selectedElementIsContainer}
            containerFit={containerFit}
            setContainerFit={setContainerFit}
            setElements={setElements}
            updateContainerFitContent={updateContainerFitContent}
            height={height}
            setHeight={setHeight}
          />
        </div>
        {isPreviewing && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="relative w-full h-full overflow-auto">
              <Button
                onClick={() => setIsPreviewing(false)}
                className="absolute top-4 right-4 z-50"
                variant="outline"
              >
                Close Preview
              </Button>
              <div className="p-4 mx-auto max-w-4xl">
                {elements.map((element) => renderPreviewElement(element))}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default Builder;

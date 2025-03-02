"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripVertical } from "lucide-react";
import React, { useState } from "react";

interface ElementType {
  id: string;
  name: string;
  content?: string;
  style?: React.CSSProperties;
  children: ElementType[];
}

function Builder() {
  const [items] = React.useState(["Text", "Container", "Heading"]);
  const [elements, setElements] = React.useState<ElementType[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  const [draggableItems, setDraggableItems] = React.useState<{
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
        if (styleName === "height") {
          newStyleVal =
            typeof styleVal === "number" ? `${styleVal}px` : styleVal;
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

  // Add Element To Container [adds a new element inside a container]
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

  // handleDropInContainer [dropping element inside a container]
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
              ? "bg-gray-800/80 hover:bg-gray-800 border-2 h-28 border-gray-600 "
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
                onBlur={() => setSelectedElementId(null)}
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
          <div className="">
            {element.children.map((child) => renderElement(child))}
          </div>
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

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gray-950">
        <div className="flex h-screen gap-4 p-4">
          {/* Left Sidebar */}
          <Card className="w-72 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-200">Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((data, index) => (
                <Button
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, data)}
                  className="h-12 w-full cursor-grab justify-start gap-2 border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  {data}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Main Canvas */}
          <Card
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e)}
            onDragLeave={handleDragLeave}
            className="flex-1 bg-gray-900 border-2 border-dashed border-gray-800"
          >
            <CardHeader>
              <CardTitle className="text-gray-200">Canvas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {elements.map((element) => renderElement(element))}
            </CardContent>
          </Card>

          {/* Properties Panel */}
          <Card className="w-72 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-200">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedElementId ? (
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="heightControl">
                      Height
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="heightControl"
                        type="number"
                        min="0"
                        value={height ?? ""}
                        onChange={(e) => {
                          const newHeight = Number(e.target.value);
                          setHeight(newHeight);
                          handleHeightChange(newHeight);
                        }}
                        className="bg-gray-800 border-gray-700 text-gray-300 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Select an element to edit its properties
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Builder;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ElementType {
  id: string;
  name: string;
  content?: string;
  style?: React.CSSProperties;
  children: ElementType[];
  // Optional custom property to store the user-defined height
  customHeight?: string;
}

interface ElementPropertyProps {
  onDragStart: (
    e: React.DragEvent<HTMLElement>,
    content: string,
    parentPath: string[]
  ) => void;
  items: string[];
  handleDragStart: (
    e: React.DragEvent<HTMLButtonElement>,
    data: string
  ) => void;
  selectedElementId: string | null;
  selectedElementIsContainer: boolean;
  containerFit: boolean;
  setContainerFit: React.Dispatch<React.SetStateAction<boolean>>;
  setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  updateContainerFitContent: (
    elements: ElementType[],
    id: string,
    fit: boolean
  ) => ElementType[];
  height: number | null;
  setHeight: React.Dispatch<React.SetStateAction<number | null>>;
}

const ElementProperty: React.FC<ElementPropertyProps> = ({
  items,
  handleDragStart,
  selectedElementId,
  selectedElementIsContainer,
  containerFit,
  setContainerFit,
  setElements,
  updateContainerFitContent,
  height,
  setHeight,
}) => {
  return (
    <Card className="w-64 bg-gray-900 border-gray-800">
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

      {/* Properties Section */}
      <CardHeader>
        <CardTitle className="text-gray-200">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedElementId ? (
            <div className="space-y-2">
              {selectedElementIsContainer ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="fitContentCheckbox"
                    type="checkbox"
                    checked={containerFit}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setContainerFit(isChecked);
                      setElements((prevElements) =>
                        updateContainerFitContent(
                          prevElements,
                          selectedElementId,
                          isChecked
                        )
                      );
                    }}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="fitContentCheckbox" className="text-gray-300">
                    Fit Content
                  </Label>
                </div>
              ) : (
                <>
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
                        const newHeight = e.target.value
                          ? Number(e.target.value)
                          : null;
                        setHeight(newHeight);
                      }}
                      className="bg-gray-800 border-gray-700 text-gray-300 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-400">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementProperty;

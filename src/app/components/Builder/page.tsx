"use client";
import React from "react";

function Builder() {
  const [items, setItems] = React.useState(["Text", "Container", "Heading"]);
  const [draggableData, setDraggableData] = React.useState("");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    from: string,
    item: string
  ) => {
    e.dataTransfer.setData("text", JSON.stringify({ from, item }));
  };

  const hanldeDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const hanldleDrop = (e: React.DragEvent<HTMLDivElement>, to: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    try {
      const { item, from } = JSON.parse(data);

      if (from === "left") {
        setItems((prev) => prev.filter((i) => i !== item));
      }
    } catch (error: unknown) {
      console.log(error);
    }
    setDraggableData(data);
  };
  return (
    <div>
      <div className="main flex h-screen w-full">
        {/* Left Section */}
        <div className="left select-none flex-1 bg-gray-100 p-4 rounded-lg m-2">
          <h2 className="text-xl font-bold mb-4">Left Section</h2>
          {items.map((data, index) => {
            return (
              <p
                key={index}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, "left", data)}
                className="text-gray-700 border border-red-500 p-4 text-center cursor-pointer"
              >
                heading
              </p>
            );
          })}
        </div>

        {/* Middle Section */}
        <div
          onDragOver={hanldeDragOver}
          onDrop={(e) => hanldleDrop(e, "middle")}
          className="middle select-none flex-1 bg-white border-l border-r border-gray-200 p-4 m-2"
        >
          <h3 className="text-lg font-semibold mb-3">Middle Section</h3>
          <h3 className="text-lg font-semibold mb-3">{draggableData}</h3>
        </div>
      </div>
    </div>
  );
}

export default Builder;

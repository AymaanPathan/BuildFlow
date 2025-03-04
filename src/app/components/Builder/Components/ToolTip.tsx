import React from "react";

export default function ToolTip() {
  return (
    <div
      id="tooltip-right"
      role="tooltip"
      className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
    >
      Tooltip on right
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
}

import React, { ReactNode } from "react";

function Theme({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-[-2] bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Main content wrapper */}
      <div className="grid grid-rows-[auto_1fr_auto]  min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default Theme;

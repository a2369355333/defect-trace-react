import React, { ReactNode } from "react";
import Toolbar from "./component/Toolbar";

interface LayoutProps {
  children: ReactNode; // The content that will be rendered inside the layout
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Toolbar at the top */}
      <Toolbar />

      {/* Main content area */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;

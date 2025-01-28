import Toolbar from "./component/Toolbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Toolbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

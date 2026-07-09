import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, name }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        style={{
          marginLeft: collapsed ? "90px" : "270px",
          background: "#F8FAFC",
          minHeight: "100vh",
          padding: "30px",
          transition: "0.3s"
        }}
      >
        <Header name={name} toggleSidebar={() => setCollapsed(!collapsed)} />

        {children}
      </main>
    </>
  );
}

export default Layout;
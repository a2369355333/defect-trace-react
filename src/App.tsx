import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Npw from "./pages/Npw";
import Layout from "./layout/Layout";
import React, { ReactElement } from "react";

function App(): ReactElement {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Npw />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


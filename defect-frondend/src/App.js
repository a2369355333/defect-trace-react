import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Npw from "./pages/Npw";
import Layout from "./layout/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Npw />} />
          <Route path="/npw" element={<Npw />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

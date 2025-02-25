import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Npw from "./pages/Npw";
import Layout from "./layout/Layout";

function App() {
  return (
    <Router base="/">
      <Layout>
        <Routes>
          <Route path="/" element={<Npw />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

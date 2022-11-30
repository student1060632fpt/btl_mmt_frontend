import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./css/style.css";
import Main from "./pages/Main";
import Receive from "./pages/Receive";
import Send from "./pages/Send";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/receive">receive</Link>
            </li>
            <li>
              <Link to="/send">sebd</Link>
            </li>
          </ul>
        </nav>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/receive" exact element={<Receive />} />
          <Route path="/send" exact element={<Send />} />
          <Route path="/" exact element={<Main/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

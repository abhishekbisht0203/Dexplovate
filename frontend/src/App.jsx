import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FileUploadPage from "./components/Upload";
import Register from "./components/Signup";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav className="p-4 bg-gray-200 flex gap-4">
          <Link to="/upload">Upload</Link>
          <Link to="/register">Register</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/upload" element={<FileUploadPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

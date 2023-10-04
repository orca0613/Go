import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeForm } from "./pages/HomeForm";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./pages/SignUp";
import { Solving } from "./pages/Solving";
import { Test } from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeForm/>} />
        <Route path="/problem" element={<Solving/>} />
        <Route path="/*" element={<NotFound/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/test" element={<Test/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;

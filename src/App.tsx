import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./pages/SignUp";
import { Solving } from "./pages/Solving";
import { TestMakingVariations } from "./pages/TestMakingVariations"
import { HomeForm } from "./pages/HomeForm";
import { MakingProblem } from "./problems/MakingProblem";
import { TestBoard } from "./components/TestBoard";
import { flowerPointPosition } from "./util/constants";
import TestStone from "./components/TestStones";
import { ProblemsList } from "./problems/problemsList";
import CanvasOverlap from "./components/TestProblem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomeForm/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/problem" element={<Solving/>} />
        <Route path="/*" element={<NotFound/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/home/test-problem" element={<MakingProblem boardSize={9}/>} />
        <Route path="/test-variations" element={<TestMakingVariations/>} />
        <Route path="/test-board" element={<TestBoard board={ProblemsList.problem2.problem} boardSize={600} />} />
        <Route path="/test-stone" element={<CanvasOverlap/>} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./components/SignUp";
import { HomeForm } from "./pages/HomeForm";
import { MakingProblem } from "./components/problem/MakingProblem";
import Layout from "./pages/layout";
import SearchingByCreator from "./components/SearchByCreator";
import SearchingByLevel from "./components/SearchByLevel";
import Search from "./pages/Search";
import AllProblems from "./components/problem/AllProblems";
import { ProblemPage } from "./components/problem/ProblemPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeForm/>} />
          <Route path="/" element={<Login/>} />
          <Route path="/problems" element={<AllProblems />} />
          <Route path="/*" element={<NotFound/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/register" element={<MakingProblem />} />
          <Route path="/search" element={<Search></Search>} />
          <Route path="/search/creator" element={<SearchingByCreator></SearchingByCreator>} />
          <Route path="/search/level" element={<SearchingByLevel></SearchingByLevel>} />
          <Route path="/problem-page/*" element={<ProblemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

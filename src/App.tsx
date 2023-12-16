import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./components/SignUp";
import { HomeForm } from "./pages/HomeForm";
import { MakingProblem } from "./components/problem/MakingProblem";
import Layout from "./pages/layout";
import SearchingByCreator from "./components/SearchByCreator";
import SearchingByLevel from "./components/SearchByLevel";
import AllProblems from "./components/problem/AllProblems";
import { ProblemPage } from "./components/problem/ProblemPage";
import { MyPage } from "./components/MyPage";
import SolvedProblems from "./components/SolvedProblems";
import UnresolvedProblems from "./components/UnresolvedProblems";
import CreatedProblems from "./components/CreatedProblems";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeForm/>} />
          <Route path="/" element={<Login/>} />
          <Route path="/all-problems" element={<AllProblems />} />
          <Route path="/*" element={<NotFound/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/create" element={<MakingProblem />} />
          <Route path="/mypage" element={<MyPage></MyPage>} />
          <Route path="/search-creator" element={<SearchingByCreator></SearchingByCreator>} />
          <Route path="/search-level" element={<SearchingByLevel></SearchingByLevel>} />
          <Route path="/problem" element={<ProblemPage />} />
          <Route path="/unresolved" element={<UnresolvedProblems />} />
          <Route path="/solved" element={<SolvedProblems />} />
          <Route path="/created" element={<CreatedProblems />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

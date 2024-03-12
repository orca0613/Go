import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Signup } from "./components/SignUp";
import { HomeForm } from "./components/HomeForm";
import { MakingProblem } from "./components/problem/MakingProblem";
import Layout from "./components/layout";
import SearchingByCreator from "./components/SearchByCreator";
import SearchingByLevel from "./components/SearchByLevel";
import AllProblems from "./components/problem/AllProblems";
import { MyPage } from "./components/MyPage";
import { ProblemBox } from "./components/problem/ProblemBox";
import { ModifyVariations } from "./components/problem/ModifyVariations";
import VerifyMail from "./components/VerifyMail";
import MyPageProblems from "./components/MyPageProblems";
import { ModifyProblem } from "./components/problem/ModifyProblem";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login/>} />
          <Route path="" element={<HomeForm/>} />
          <Route path="/all-problems" element={<AllProblems />} />
          <Route path="/*" element={<NotFound/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/create" element={<MakingProblem />} />
          <Route path="/mypage" element={<MyPage></MyPage>} />
          <Route path="/mypage/:part" element={<MyPageProblems></MyPageProblems>} />
          <Route path="/search-creator" element={<SearchingByCreator></SearchingByCreator>} />
          <Route path="/search-level" element={<SearchingByLevel></SearchingByLevel>} />
          <Route path="/problem/:problemId" element={<ProblemBox />} />
          <Route path="/modify/:problemId" element={<ModifyVariations />} />
          <Route path="/verify/:userId" element={<VerifyMail />} />
          <Route path="/modify-problem/:problemId" element={<ModifyProblem />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

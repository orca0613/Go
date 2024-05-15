import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Signup } from "./components/SignUp";
import { HomeForm } from "./components/HomeForm";
import { MakingProblem } from "./components/problem/MakingProblem";
import Layout from "./components/layout";
import { ProblemBox } from "./components/problem/ProblemBox";
import { ModifyVariations } from "./components/problem/ModifyVariations";
import VerifyMail from "./components/VerifyMail";
import MyPageProblems from "./components/problem/MyPageProblems";
import { ModifyProblem } from "./components/problem/ModifyProblem";
import ChangePassword from "./components/ChangePassword";
import Setting from "./components/Setting";
import FilteredProblems from "./components/problem/FilteredProblems";
import MessageList from "./components/MessageList";
import UserPage from "./components/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login/>} />
          <Route path="" element={<HomeForm/>} />
          <Route path="/*" element={<NotFound/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/create" element={<MakingProblem />} />
          <Route path="/mypage/:part" element={<MyPageProblems></MyPageProblems>} />
          <Route path="/problem/:param" element={<ProblemBox />} />
          <Route path="/modify/:param" element={<ModifyVariations />} />
          <Route path="/verify/:userId" element={<VerifyMail />} />
          <Route path="/modify-problem/:param" element={<ModifyProblem />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
          <Route path="/setting" element={<Setting/>} />
          <Route path="/problems/:params" element={<FilteredProblems />} />
          <Route path="/message" element={<MessageList />} />
          <Route path="/userpage/:name" element={<UserPage/>}/>
          

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

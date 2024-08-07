import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Signup } from "./components/SignUp";
import { HomeForm } from "./components/HomeForm";
import { MakingProblem } from "./components/problem/MakingProblem";
import Layout from "./components/layout";
import { ModifyProblem } from "./components/problem/ModifyProblem";
import ChangePassword from "./components/ChangePassword";
import Setting from "./components/Setting";
import UserPage from "./components/UserPage";
import { ProblemBox } from "./components/problem/ProblemBox";
import { MyPageProblemBox } from "./components/problem/MyPageProblemBox";
import FilteredProblemBox from "./components/problem/FilteredProblemBox";
import { ModifyVariationsBox } from "./components/problem/ModifyVariationsBox";
import { MessagePage } from "./components/MessagePage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<HomeForm/>} />
          <Route path="/*" element={<NotFound/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/create" element={<MakingProblem />} />
          <Route path="/mypage/:param" element={<MyPageProblemBox></MyPageProblemBox>} />
          <Route path="/problem/:param" element={<ProblemBox />} />
          <Route path="/modify/:param" element={<ModifyVariationsBox />} />
          <Route path="/modify-problem/:param" element={<ModifyProblem />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
          <Route path="/setting" element={<Setting/>} />
          <Route path="/problems/:params" element={<FilteredProblemBox />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/userpage/:name" element={<UserPage/>}/>
          

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

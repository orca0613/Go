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
import MyPageProblems from "./components/MyPageProblems";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Test } from "./components/Test";
import { ModifyVariations } from "./components/problem/ModifyVariations";
import { ProblemBox } from "./components/problem/ProblemBox";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7tiUJ7S9KQIjTS96WM-ZRvKKBcrOyoZE",
  authDomain: "majestic-disk-411707.firebaseapp.com",
  projectId: "majestic-disk-411707",
  storageBucket: "majestic-disk-411707.appspot.com",
  messagingSenderId: "306960835852",
  appId: "1:306960835852:web:a22ececdad81e16a7d9529",
  measurementId: "G-Q5L41N94M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeForm/>} />
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
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

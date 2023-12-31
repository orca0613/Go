
// import { useEffect, useState } from "react";
// import _ from 'lodash'
// import {  Box, Button, Typography, useMediaQuery } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { MakingVariations } from "./problem/MakingVariations";
// import { Problem } from "./problem/Problem";
// import { ModifyProblem } from "./problem/ModifyProblem";
// import { addElement, getProblemInformations, removeProblem } from "../util/network";
// import { LANGUAGE_IDX, SOLVED, USERNAME, initialVariations } from "../util/constants";
// import { ShowAnswer } from "./problem/ShowAnswer";
// import { menuWords } from "../util/menuWords";
// import { SelfMode } from "./problem/SelfMode";
// import { ReplyBox } from "./ReplyBox";
// import { LikeAndDislike } from "./LikeAndDislike";
// import { ProblemInfo } from "../util/types";
// import { ProblemInformation } from "./problem/ProblemInformation";
// import problemStore from "../store/problemStore";
// import { setProblemIndex } from "../redux/actions";

// interface ProblemPageProps {
//   problemInfo: ProblemInfo
// }

// export function Test({ problemInfo }: ProblemPageProps) {
//   const navigate = useNavigate()
//   const problemId = problemInfo._id
//   const answers = problemInfo.answers
//   const creator = problemInfo.creator
//   const username = localStorage.getItem(USERNAME)?? ""
//   const isMobile = useMediaQuery("(max-width: 600px)")
//   const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
//   const [information, setInformation] = useState({
//     problemInfo: problemInfo,
//     correct: 0,
//     wrong: 0,
//     view: 0, 
//   })

//   const [info, setInfo] = useState({
//     problemId: problemId,
//     creator: creator,
//     selfPlayMode: false,
//     modifyMode: false,
//     variationMode: true,
//     showAnswerMode: false,
//     answerRegistered: _.isEqual(answers, initialVariations)
//   })

//   function changeInfo(where: string, val: any) {
//     setInfo({
//       ...info,
//       [where]: val
//     })
//   }

//   useEffect(() => {

//     const newInformation = getProblemInformations(problemInfo._id)
//     .then(information => {
//       setInformation({
//         problemInfo: problemInfo,
//         correct: information.correct,
//         wrong: information.wrong,
//         view: information.view
//       })
//     })
//   }, [problemInfo])

//   function modifyVariations() {
//     if (info.creator !== username) {
//       alert("권한이 없습니다.")
//       return
//     }
//     changeInfo("modifyMode", !info.modifyMode)
//   }

//   function setShowAnswerAndsetSolved() {
//     if (info.showAnswerMode) {
//       changeInfo("showAnswerMode", false)
//       return
//     }
//     changeInfo("showAnswerMode", true)
//     addElement(info.problemId, username, SOLVED)
//   }

//   function removeProblemAndMove() {
//     removeProblem(problemInfo._id, info.creator)
//     navigate("/home")
//   }

//   function moveToNextProblem() {
//     const problemList = problemStore.getState().problemList
//     const index = problemStore.getState().curIndex
//     if (problemList.length === 0 || index < 0 || problemList.length <= index + 1) {
//       console.log("shit")
//       return
//     }
//     problemStore.dispatch(setProblemIndex(index + 1))
//     const nextProblemId = problemList[index + 1]._id
//     navigate(`/box/${nextProblemId}`)
//   }

//   function moveToPreviousProblem() {
//     const problemList = problemStore.getState().problemList
//     const index = problemStore.getState().curIndex
//     if (problemList.length === 0 || index <= 0) {
//       console.log("shit")
//       return
//     }
//     problemStore.dispatch(setProblemIndex(index - 1))
//     const nextProblemId = problemList[index - 1]._id
//     navigate(`/box/${nextProblemId}`)
//   }

//   return (
//     <Box>
//       <Box display="flex" textAlign="center">
//         <Box
//           sx={{
//             flex: isMobile ? undefined : `0 0 200px`,
//             mr: isMobile ? '0' : '1ch',
//             width: 300
//           }}
//         >
//           <ProblemInformation {...information}></ProblemInformation>
//           {info.answerRegistered?
//             <></> :
//             <Typography sx={{color: "red", fontSize:10}}>{menuWords.noAnswerWarning[languageIdx]}</Typography>
//           }
//           <Box textAlign="center">
//             {info.modifyMode? 
//             <Box>
//               <Button sx={{margin: 3}} onClick={modifyVariations}>{menuWords.returnProblem[languageIdx]}</Button>
//               <Button onClick={() => changeInfo("variationMode", !info.variationMode)}>
//                 {info.variationMode? menuWords.modifyProblem[languageIdx] : menuWords.modifyVariations[languageIdx]}
//               </Button>
//             </Box> : 
//             <Box display="grid">
//               <Button sx={{margin: 2}} onClick={() => changeInfo("selfPlayMode", !info.selfPlayMode)}>{info.selfPlayMode? menuWords.try[languageIdx] : menuWords.practice[languageIdx]}</Button>
//               <Button sx={{margin: 2}} onClick={moveToPreviousProblem}>{menuWords.previousProblem[languageIdx]}</Button>
//               <Button sx={{margin: 2}} onClick={moveToNextProblem}>{menuWords.nextProblem[languageIdx]}</Button>
//               <Button sx={{margin: 2}} onClick={setShowAnswerAndsetSolved}>{info.showAnswerMode? menuWords.returnProblem[languageIdx] : menuWords.showAnswer[languageIdx]}</Button>
//               {info.creator === username? 
//                 <Box display="grid">
//                   <Button sx={{margin: 2}} onClick={modifyVariations}>{info.modifyMode? menuWords.returnProblem[languageIdx] : menuWords.modify[languageIdx]}</Button>
//                   <Button sx={{color: "red"}} onClick={removeProblemAndMove}>{menuWords.deleteProblem[languageIdx]}</Button>
//                 </Box> : <LikeAndDislike problemId={problemInfo._id} username={username}></LikeAndDislike>}
//             </Box>
//             }
//           </Box>
//         </Box>
//         {info.modifyMode? 
//         <>
//           {info.variationMode? <MakingVariations problemInfo={problemInfo}></MakingVariations> :
//           <ModifyProblem problemInfo={problemInfo}></ModifyProblem>}
//         </> :
//         <>
//           {info.showAnswerMode? 
//           <ShowAnswer problemInfo={problemInfo} /> : 
//           info.selfPlayMode? 
//           <SelfMode problemInfo={problemInfo} /> : 
//           <Problem problemInfo={problemInfo} />}
//         </>}
//       </Box>
//       <Box sx={{mt:10}}>
//         {info.modifyMode? <></> : <ReplyBox problemId={info.problemId} />}
//       </Box>
//     </Box>
//   )
// }


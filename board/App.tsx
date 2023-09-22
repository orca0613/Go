import { GoPosition } from "./GoPosition";
import { testProblem } from "../../problems/problem1";

const lineSpacing = 40
const N = 13

function App() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <GoPosition
        lines={N}
        lineSpacing={lineSpacing}
        board={testProblem}
      />
    </div>
  );
}

export default App;

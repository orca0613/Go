import { GoPosition } from "./GoPosition";
import { test_problem } from "./types";

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
        moves={test_problem}
      />
    </div>
  );
}

export default App;

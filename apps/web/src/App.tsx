import Draggable from "react-draggable";
import { useAliasListener } from "./pages/linkedIn/hooks";
import { LinkedInPage } from "./pages/linkedIn/linkedIn";

function App() {
  const alias = useAliasListener();
  return (
    <Draggable>
      <div className="rounded-xl flex flex-col bg-white gap-8 h-[600px]">
        {alias ? (
          <LinkedInPage alias={alias} />
        ) : (
          <div className="h-[100vh] text-black flex flex-col items-center justify-center">
            Not found
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default App;

import { useAuth } from "@clerk/clerk-react";
import { Button } from "./components/ui/button";
import { useAliasListener } from "./pages/linkedIn/hooks";
import { LinkedInPage } from "./pages/linkedIn/linkedIn";
import { LogOutIcon } from "lucide-react";

function App() {
  const { signOut } = useAuth();
  const alias = useAliasListener();
  return (
    <div className="rounded-xl flex flex-col bg-white gap-8 h-[600px]">
      {alias ? (
        <LinkedInPage alias={alias} />
      ) : (
        <div className="h-[100vh] text-black flex flex-col items-center justify-center">
          Not found
        </div>
      )}
      <div className="absolute bottom-0 flex flex-col items-center justify-center m-4">
        <Button variant="ghost" className="p-3" onClick={() => signOut()}>
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
}

export default App;

import { Loader2 } from "lucide-react";

export const CenterSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

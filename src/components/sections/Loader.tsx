import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { XCircle } from "lucide-react";

interface LoadingProps {
  loadingStates: { text: string }[];
  loading: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function Loading({ loadingStates, loading, onStart, onStop }: LoadingProps) {
  return (
    <>
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
      {loading && (
        <button
          className="fixed top-4 right-4 text-black bg-transparent! p-0! outline-none! border-0! hover:border-0! focus:border-0! z-120"
          onClick={onStop}
        >
          <XCircle className="h-10 w-10 text-black" />
        </button>
      )}
    </>
  );
}
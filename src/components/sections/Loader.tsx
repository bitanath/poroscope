import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { XCircle } from "lucide-react";

interface LoadingProps {
  loadingStates: { text: string }[];
  loading: boolean;
  error: boolean;
  setLoading: (loading:boolean) => void;
}

export function Loading({ loadingStates, loading, error, setLoading }: LoadingProps) {

  return (
    <>
      <Loader loadingStates={loadingStates} loading={loading} duration={10000} loop={true} error={error} />
      {loading && (
        <button
          className="fixed top-4 right-4 text-black bg-transparent! p-0! outline-none! border-0! hover:border-0! focus:border-0! z-120"
          onClick={()=>{setLoading(false)}}
        >
          <XCircle className="h-10 w-10 text-black" />
        </button>
      )}
    </>
  );
}
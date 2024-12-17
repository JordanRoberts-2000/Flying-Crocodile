import { useEffect } from "react";
import { toast } from "sonner";

function useErrorNotification(isError: boolean, title: string) {
  useEffect(() => {
    if (isError) {
      toast.error(title);
    }
  }, [isError]);
}

export default useErrorNotification;

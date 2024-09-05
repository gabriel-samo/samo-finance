"use client";

import { useMountedState } from "react-use";
import NewAccountSheet from "@/features/accounts/components/new-account-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();
  // equivalent to:
  // const [isMounted, setIsMounted] = useState(false);
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
    </>
  );
};

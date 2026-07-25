import { useContext } from "react";
import { AppendMembersContext } from "../contexts";

export const useAppendMembersContext = () => {
  const context = useContext(AppendMembersContext);
  if (!context) {
    throw new Error(
      "useAppendMembersContext must be used within AppendMembersProvider",
    );
  }
  return context;
};

export default useAppendMembersContext;

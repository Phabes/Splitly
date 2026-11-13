import { useContext } from "react";
import { AddMembersContext } from "../contexts";

export const useAddMembersContext = () => {
  const context = useContext(AddMembersContext);
  if (!context) {
    throw new Error(
      "useAddMembersContext must be used within AddMembersProvider",
    );
  }
  return context;
};

export default useAddMembersContext;

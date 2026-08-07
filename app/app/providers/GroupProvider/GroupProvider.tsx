import { GroupContext } from "@/app/contexts";
import { FC, PropsWithChildren, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { useGroupDetailsData } from "./hooks";

type GroupProviderProps = PropsWithChildren & {
  groupID: string;
};

export const GroupProvider: FC<GroupProviderProps> = ({
  groupID,
  children,
}) => {
  const {
    isLoading,
    userRole,
    groupDetails,
    setGroupUpdates,
    setGroupMembers,
  } = useGroupDetailsData(groupID);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshGroupDetails",
      setGroupUpdates,
    );

    return () => {
      subscription.remove();
    };
  }, [setGroupUpdates]);

  return (
    <GroupContext.Provider
      value={{ groupID, isLoading, groupDetails, userRole, setGroupMembers }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;

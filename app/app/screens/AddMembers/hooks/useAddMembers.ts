import {
  useAppNavigation,
  useAuthenticatedApi,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { addMembersCall } from "@/app/services";
import { AddMembersResponse, ResponseMessage, SimpleUser } from "@/app/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useAddMembers = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const request = useAuthenticatedApi();
  const { hideLoading, showLoading } = useLoadingContext();

  const route = useRoute<RouteProp<AppStackParamList, "AddMembers">>();
  const { groupID, initialSelectedUsers = [], returnEvent } = route.params;

  const [selectedUsersData, setSelectedUsersData] =
    useState<SimpleUser[]>(initialSelectedUsers);

  const toggleMember = (userObj: SimpleUser) => {
    const id = userObj._id;

    setSelectedUsersData((prev) =>
      prev.some((u) => u._id === id)
        ? prev.filter((u) => u._id !== id)
        : [...prev, userObj],
    );
  };

  const handleConfirm = async () => {
    if (groupID) {
      showLoading(translations["addingMembers"]);

      const userIDs = selectedUsersData.map((user) => user._id);

      try {
        const response = await request(addMembersCall, groupID, userIDs);
        if (response.ok) {
          const data: AddMembersResponse = await response.json();
          DeviceEventEmitter.emit(returnEvent, data.members);

          navigation.goBack();
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Error during adding members
        console.error(error);
      } finally {
        hideLoading();
      }
    } else {
      DeviceEventEmitter.emit(returnEvent, selectedUsersData);

      navigation.goBack();
    }
  };

  return { groupID, selectedUsersData, toggleMember, handleConfirm };
};

export default useAddMembers;

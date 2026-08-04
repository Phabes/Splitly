import { Button, NavBar, TopTabScreen, TopTabSelector } from "@/app/components";
import { AddMembersContext } from "@/app/contexts";
import {
  useAppNavigation,
  useAuthenticatedApi,
  useLoadingContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { LayoutProvider } from "@/app/providers";
import { addMembersCall } from "@/app/services";
import { ResponseMessage } from "@/app/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { Searching, Selected } from "./tabs";

export const AddMembers: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const request = useAuthenticatedApi();
  const { hideLoading, showLoading } = useLoadingContext();

  const route = useRoute<RouteProp<AppStackParamList, "AddMembers">>();
  const {
    groupID,
    initialSelectedUsers = [],
    returnEvent,
  } = route.params || {};

  const [selectedUsersData, setSelectedUsersData] =
    useState<{ _id: string; username: string }[]>(initialSelectedUsers);

  const toggleMember = (userObj: { _id: string; username: string }) => {
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
          DeviceEventEmitter.emit(returnEvent);
          navigation.goBack();
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    } else {
      DeviceEventEmitter.emit(returnEvent, selectedUsersData);
      navigation.goBack();
    }
  };

  const styles = useStyles();

  return (
    <AddMembersContext value={{ groupID, selectedUsersData, toggleMember }}>
      <LayoutProvider
        navbar={
          <NavBar
            text={translations["addMembers"]}
            onBackPress={navigation.goBack}
          />
        }
      >
        <View style={styles.container}>
          <TopTabSelector>
            <TopTabScreen
              name="Searching"
              component={Searching}
            />
            <TopTabScreen
              name="Selected"
              component={Selected}
            />
          </TopTabSelector>

          <View style={styles.buttons}>
            <Button
              text={`${translations["addMembers"]} (${selectedUsersData.length})`}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </LayoutProvider>
    </AddMembersContext>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(3) },
    buttons: {
      gap: theme.spacing(3),
    },
  });
};

export default AddMembers;

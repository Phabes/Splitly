import { Button, NavBar, TopTabScreen, TopTabSelector } from "@/app/components";
import {
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { AddMembersProvider, LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Searching, Selected } from "./tabs";
import { useAddMembers } from "./hooks";

export const AddMembers: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const { groupID, selectedUsersData, toggleMember, handleConfirm } =
    useAddMembers();

  const styles = useStyles();

  return (
    <AddMembersProvider
      groupID={groupID}
      selectedUsersData={selectedUsersData}
      toggleMember={toggleMember}
    >
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
    </AddMembersProvider>
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

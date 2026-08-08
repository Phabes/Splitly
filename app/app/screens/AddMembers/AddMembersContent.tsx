import { Button, NavBar, TopTabScreen, TopTabSelector } from "@/app/components";
import {
  useAddMembersContext,
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { StyleSheet, View } from "react-native";
import { Searching, Selected } from "./tabs";

export const AddMembersContent = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const { selectedUsersData, handleConfirm } = useAddMembersContext();

  const styles = useStyles();

  return (
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

export default AddMembersContent;

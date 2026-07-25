import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, NavBar, TopTabScreen, TopTabSelector } from "@/app/components";
import {
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { Searching, Selected } from "./tabs";
import { AppendMembersContext } from "@/app/contexts";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";

export const AppendMembers: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const route = useRoute<RouteProp<AppStackParamList, "AppendMembers">>();
  const { groupID } = route.params;

  const [selectedUsersData, setSelectedUsersData] = useState<
    { _id: string; username: string }[]
  >([]);

  const toggleMember = (userObj: { _id: string; username: string }) => {
    const id = userObj._id;

    setSelectedUsersData((prev) =>
      prev.some((u) => u._id === id)
        ? prev.filter((u) => u._id !== id)
        : [...prev, userObj],
    );
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  const styles = useStyles();

  return (
    <AppendMembersContext value={{ groupID, selectedUsersData, toggleMember }}>
      <LayoutProvider
        navbar={
          <NavBar
            text={translations["addMembers"]}
            onBackPress={handleConfirm}
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
    </AppendMembersContext>
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

export default AppendMembers;

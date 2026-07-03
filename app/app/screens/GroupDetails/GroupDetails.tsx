import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  NavBar,
  Typography,
  Scroll,
  TabSelector,
  Fab,
  TouchableIcon,
  LoadingWrapper,
} from "@/app/components";
import {
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { renderTabContent } from "./mocks/renderTabContent";
import { useGroupDetailsData } from "./hooks";

export const GroupDetails: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const route = useRoute<RouteProp<AppStackParamList, "GroupDetails">>();
  const { groupID } = route.params;
  const { isLoading, isAdmin, groupDetails } = useGroupDetailsData(groupID);

  const styles = useStyles();

  const GROUP_TABS = ["expenses", "balances", "members"] as const;
  type GroupTab = (typeof GROUP_TABS)[number];

  const [activeTab, setActiveTab] = useState<GroupTab>("expenses");

  const mockGroupName = "✈️ Trip to Paris";
  const mockTotalSpend = "1,250.00 PLN";
  const mockPersonalBalance = "🟢 You are owed 150.00 PLN";

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groupDetails"]}
          onBackPress={navigation.goBack}
        />
      }
    >
      <LoadingWrapper isLoading={isLoading}>
        <View style={styles.container}>
          <View style={styles.heroSection}>
            <View style={styles.titleWrapper}>
              <Typography
                text={mockGroupName}
                variant="header-large"
              />
              {isAdmin && (
                <View style={styles.editIcon}>
                  <TouchableIcon
                    icon="Cog"
                    onPress={() =>
                      navigation.navigate("EditGroup", groupDetails!)
                    }
                    size="small"
                    color="text-secondary"
                  />
                </View>
              )}
            </View>

            <View style={styles.totalSpend}>
              <Typography
                text={translations["totalGroupSpend"]}
                color="text-secondary"
                variant="body-small"
              />
              <Typography
                text={mockTotalSpend}
                variant="header-medium"
              />
            </View>

            <View style={styles.balanceBadge}>
              <Typography
                text={mockPersonalBalance}
                variant="body-large"
              />
            </View>
          </View>

          <TabSelector
            tabs={GROUP_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <Scroll>
            <View style={styles.scrollContent}>
              {renderTabContent(activeTab, styles)}
            </View>
          </Scroll>
        </View>
        {activeTab === "expenses" && <Fab onPress={() => {}} />}
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    heroSection: {
      alignItems: "center",
      paddingVertical: theme.spacing(2),
      gap: theme.spacing(2),
    },
    titleWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing(2),
      width: "100%",
    },
    editIcon: {
      position: "absolute",
      right: 0,
    },
    totalSpend: {
      alignItems: "center",
    },
    balanceBadge: {
      backgroundColor: theme.colors["background-secondary"],
      paddingVertical: theme.spacing(2),
      paddingHorizontal: theme.spacing(3),
      borderRadius: theme.spacing(3),
    },
    scrollContent: {
      padding: theme.spacing(2),
      flex: 1,
    },
    tabContent: {
      gap: theme.spacing(1),
    },
    dateHeader: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    expenseRight: {
      alignItems: "flex-end",
    },
    settleUpContainer: {
      marginTop: theme.spacing(4),
    },
    addMemberContainer: {
      marginTop: theme.spacing(4),
    },
  });
};

export default GroupDetails;

import {
  LoadingWrapper,
  NavBar,
  TopTabScreen,
  TopTabSelector,
  TouchableIcon,
  Typography,
} from "@/app/components";
import {
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { GroupProvider, LayoutProvider } from "@/app/providers";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useGroupDetailsData } from "./hooks";
import { Members } from "./tabs";

export const GroupDetails: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const route = useRoute<RouteProp<AppStackParamList, "GroupDetails">>();
  const { groupID } = route.params;
  const { isLoading, isAdmin, groupDetails } = useGroupDetailsData(groupID);

  const styles = useStyles();

  const mockTotalSpend = "1,250.00 PLN";
  const mockPersonalBalance = "🟢 You are owed 150.00 PLN";

  return (
    <GroupProvider
      groupID={groupID}
      groupDetails={groupDetails}
      isAdmin={isAdmin}
    >
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
                  text={groupDetails ? groupDetails.name : ""}
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

            <TopTabSelector>
              <TopTabScreen
                name="Expenses"
                component={Members}
              />
              <TopTabScreen
                name="Balances"
                component={Members}
              />
              <TopTabScreen
                name="Members"
                component={Members}
              />
            </TopTabSelector>
          </View>
        </LoadingWrapper>
      </LayoutProvider>
    </GroupProvider>
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
  });
};

export default GroupDetails;

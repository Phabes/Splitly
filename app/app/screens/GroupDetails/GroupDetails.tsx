import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  NavBar,
  Typography,
  ListItem,
  Scroll,
  TabSelector,
  Fab,
  TouchableIcon,
} from "@/app/components";
import {
  useAppNavigation,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";

export const GroupDetails: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const styles = useStyles();

  const GROUP_TABS = ["expenses", "balances", "members"] as const;
  type GroupTab = (typeof GROUP_TABS)[number];

  const [activeTab, setActiveTab] = useState<GroupTab>("expenses");

  const mockGroupName = "✈️ Trip to Paris";
  const mockTotalSpend = "1,250.00 PLN";
  const mockPersonalBalance = "🟢 You are owed 150.00 PLN";

  const renderTabContent = () => {
    switch (activeTab) {
      case "expenses":
        return (
          <View style={styles.tabContent}>
            <View style={styles.dateHeader}>
              <Typography
                text="TODAY"
                color="text-secondary"
              />
            </View>
            <ListItem
              text="Dinner at Mario's"
              onPress={() => {}}
            >
              <View style={styles.expenseRight}>
                <Typography
                  text="250.00 PLN"
                  variant="body-large"
                />
                <Typography
                  text="Paid by Piotr"
                  variant="body-small"
                  color="text-secondary"
                />
              </View>
            </ListItem>

            <View style={styles.dateHeader}>
              <Typography
                text="YESTERDAY"
                color="text-secondary"
              />
            </View>
            <ListItem
              text="Uber to Hotel"
              onPress={() => {}}
            >
              <View style={styles.expenseRight}>
                <Typography
                  text="80.00 PLN"
                  variant="body-large"
                />
                <Typography
                  text="Paid by You"
                  variant="body-small"
                />
              </View>
            </ListItem>

            <ListItem
              text="Airbnb (3 nights)"
              onPress={() => {}}
            >
              <View style={styles.expenseRight}>
                <Typography
                  text="920.00 PLN"
                  variant="body-large"
                />
                <Typography
                  text="Paid by Anna"
                  variant="body-small"
                  color="text-secondary"
                />
              </View>
            </ListItem>
          </View>
        );
      case "balances":
        return (
          <View style={styles.tabContent}>
            <ListItem
              text="Anna"
              onPress={() => {}}
            >
              <Typography
                text="25.00 PLN"
                variant="body-large"
                color="text-primary"
              />
            </ListItem>
            <ListItem
              text="You"
              onPress={() => {}}
            >
              <Typography
                text="15.00 PLN"
                variant="body-large"
              />
            </ListItem>
            <View style={styles.settleUpContainer}>
              <Button
                text="Settle Up"
                variant="secondary"
                onPress={() => {}}
              />
            </View>
          </View>
        );
      case "members":
        return (
          <View style={styles.tabContent}>
            <ListItem
              text="You"
              onPress={() => {}}
            />
            <ListItem
              text="Anna"
              onPress={() => {}}
            />
            <ListItem
              text="Piotr"
              onPress={() => {}}
            />
            <ListItem
              text="Kasia"
              onPress={() => {}}
            />

            <View style={styles.addMemberContainer}>
              <Button
                text="Add more members"
                variant="secondary"
                onPress={() => {}}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groupDetails"]}
          onBackPress={navigation.goBack}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.titleWrapper}>
            <Typography
              text={mockGroupName}
              variant="header-large"
            />
            <View style={styles.editIcon}>
              <TouchableIcon
                icon="Cog"
                onPress={() => {}}
                size="small"
                color="text-secondary"
              />
            </View>
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
          <View style={styles.scrollContent}>{renderTabContent()}</View>
        </Scroll>
      </View>
      {activeTab === "expenses" && <Fab onPress={() => {}} />}
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

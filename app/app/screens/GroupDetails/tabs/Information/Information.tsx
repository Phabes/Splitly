import {
  LoadingWrapper,
  NavBar,
  TouchableIcon,
  Typography,
} from "@/app/components";
import { COUNTRY_CODES } from "@/app/constants/countries";
import {
  useAppNavigation,
  useGroupContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Members } from "./components";
import { useParentGoBack } from "../hooks";

export const Information: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const handleBackPress = useParentGoBack();
  const { groupDetails, userRole, isLoading } = useGroupContext();

  const styles = useStyles();

  const isValidFlag = groupDetails && COUNTRY_CODES.includes(groupDetails.icon);

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groupDetails"]}
          onBackPress={handleBackPress}
        />
      }
    >
      <LoadingWrapper isLoading={isLoading}>
        <View style={styles.container}>
          <View style={styles.heroSection}>
            <View style={styles.titleWrapper}>
              {isValidFlag && (
                <CountryFlag
                  isoCode={groupDetails.icon}
                  size={18}
                  style={styles.selectedFlag}
                />
              )}
              <Typography
                text={groupDetails ? groupDetails.name : ""}
                variant="header-large"
              />
              {userRole === "owner" && (
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
          </View>

          <Members />
        </View>
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
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    selectedFlag: {
      borderRadius: theme.spacing(1),
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
    tabContainer: { flex: 1 },
    scrollContent: {
      flex: 1,
      gap: theme.spacing(3),
      paddingHorizontal: theme.spacing(3),
    },
    members: {
      gap: theme.spacing(2),
    },
  });
};

export default Information;

import {
  Button,
  Input,
  LoadingWrapper,
  NavBar,
  Scroll,
} from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";

export const Friends: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const [searchValue, setSearchValue] = useState("");

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["friends"]}
          button={
            <Button
              text={translations["signOut"]}
              onPress={signOut}
            />
          }
        />
      }
    >
      <LoadingWrapper isLoading={false}>
        <Input
          text={searchValue}
          onChange={setSearchValue}
          placeholder={translations["searchFriends"]}
          beginIcon={faSearch}
        />
        <View style={styles.mainButtons}>
          <Button
            text={translations["addFriend"]}
            onPress={() => navigation.navigate("AddFriend")}
            fullWidth={true}
          />
          <Button
            text={translations["friendRequests"]}
            onPress={() => {}}
            fullWidth={true}
          />
        </View>
        <Scroll></Scroll>
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    mainButtons: { flexDirection: "row", gap: theme.spacing(4) },
  });
};

export default Friends;

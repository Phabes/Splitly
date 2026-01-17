import {
  Button,
  Input,
  ListItem,
  LoadingWrapper,
  NavBar,
  Scroll,
  TouchableIcon,
  Typography,
} from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { faAdd, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

interface UserResult {
  id: string;
  username: string;
  email: string;
}

export const AddFriend: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    if (searchValue.trim().length < 3) {
      // setResults([]);
      // setIsSearching(false);
      return;
    }

    // setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        console.log("Fetching results from server for:", searchValue);

        // --- REAL API CALL GOES HERE ---
        // const response = await fetch(`https://api.splitly.app/search?q=${searchValue}`);
        // const data = await response.json();

        // Mocking the server response
        const mockResponse: UserResult[] = [
          { id: "1", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "2", username: "Anna Nowak", email: "anna@example.com" },
          { id: "3", username: "Adam Mickiewicz", email: "adam@example.com" },
          { id: "4", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "5", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "6", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "7", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "8", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "9", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "10", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "11", username: "Jan Kowalski", email: "jan@example.com" },
          { id: "12", username: "Jan Kowalski", email: "jan@example.com" },
        ].filter(
          (user) =>
            user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase()),
        );

        setResults(mockResponse);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleShowFriend = (userId: string) => {
    Keyboard.dismiss();
    console.log("Show friend profile:", userId);
  };

  const handleAddFriend = (userId: string) => {
    Keyboard.dismiss();
    console.log("Sending friend request to:", userId);
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    if (text.trim().length >= 3) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  };

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["addFriend"]}
          onBackPress={navigation.goBack}
          button={
            <Button
              text={translations["signOut"]}
              onPress={signOut}
            />
          }
        />
      }
    >
      <View style={styles.container}>
        <Input
          text={searchValue}
          onChange={handleSearchChange}
          placeholder={translations["searchFriends"]}
          beginIcon={faSearch}
        />
        <LoadingWrapper isLoading={isSearching}>
          {results.length > 0 ? (
            <>
              <Typography text={`${translations["searchedUsers"]}:`} />
              <Scroll gapSize="small">
                {results.map((item, i) => {
                  return (
                    <ListItem
                      key={`AddFriend/${i}`}
                      text={item.username}
                      onPress={() => handleShowFriend(item.id)}
                    >
                      <TouchableIcon
                        icon={faAdd}
                        onPress={() => handleAddFriend(item.id)}
                      />
                    </ListItem>
                  );
                })}
              </Scroll>
            </>
          ) : (
            searchValue.length >= 3 &&
            !isSearching && (
              <View style={styles.noUsers}>
                <Typography text="No users found matching your search." />
              </View>
            )
          )}
        </LoadingWrapper>
      </View>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(2) },
    noUsers: { alignItems: "center" },
  });
};

export default AddFriend;

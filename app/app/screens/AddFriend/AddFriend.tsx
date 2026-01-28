import {
  Button,
  Input,
  ListItem,
  Loading,
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
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useAddFriendData } from "./hooks";
import { ADD_FRIENDS_MIN_SEARCH_LENGTH } from "@/app/constants/pagination";

export const AddFriend: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    searchValue,
    users,
    isSearching,
    isLoadingMore,
    hasMore,
    handleSearchChange,
    loadMoreUsers,
    forceLoadMore,
  } = useAddFriendData();

  const styles = useStyles();

  const handleShowFriend = (userId: string) => {
    console.log("Show friend profile:", userId);
  };

  const handleAddFriend = (userId: string) => {
    console.log("Sending friend request to:", userId);
  };

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

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
          {users.length > 0 ? (
            <>
              <Typography
                text={`${translations["searchedUsers"]}:`}
                variant="header-small"
              />
              <Scroll
                gapSize="small"
                keyboardPersist="never"
                handleScrollEnd={loadMoreUsers}
                isAtEnd={!hasMore}
                onManualRefresh={handleManualRefresh}
              >
                {users.map((item, i) => {
                  return (
                    <ListItem
                      key={`AddFriend/${i}`}
                      text={item.username}
                      onPress={() => handleShowFriend(item._id)}
                    >
                      <TouchableIcon
                        icon={faAdd}
                        onPress={() => handleAddFriend(item._id)}
                      />
                    </ListItem>
                  );
                })}
                <View style={styles.footerContainer}>
                  {isLoadingMore && (
                    <>
                      <Loading />
                      <Typography
                        text={translations["loadingMoreUsers"]}
                        variant="body-small"
                      />
                    </>
                  )}

                  {!isLoadingMore && !hasMore && (
                    <Typography
                      text={translations["noMoreUsersFound"]}
                      variant="body-small"
                    />
                  )}
                </View>
              </Scroll>
            </>
          ) : (
            searchValue.length >= ADD_FRIENDS_MIN_SEARCH_LENGTH &&
            !isSearching && (
              <View style={styles.noUsers}>
                <Typography text={translations["noUsersFoundMatching"]} />
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
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default AddFriend;

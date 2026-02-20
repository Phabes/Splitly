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
import { useUsers } from "./hooks";
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
    handleAddFriend,
    handleShowFriend,
  } = useUsers();

  const styles = useStyles();

  const isManualRefreshDisabled =
    isLoadingMore || searchValue.length < ADD_FRIENDS_MIN_SEARCH_LENGTH;

  const handleManualRefresh = isManualRefreshDisabled
    ? undefined
    : forceLoadMore;

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
          <Scroll
            gapSize="small"
            keyboardPersist="never"
            centerContent={users.length === 0}
            hasMore={hasMore}
            handleScrollEnd={loadMoreUsers}
            onManualRefresh={handleManualRefresh}
          >
            {users.length > 0 && (
              <Typography
                text={`${translations["searchedUsers"]}:`}
                variant="header-small"
              />
            )}

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

              {!isLoadingMore && !hasMore && users.length > 0 && (
                <Typography
                  text={translations["noMoreUsersFound"]}
                  variant="body-small"
                />
              )}

              {!isLoadingMore &&
                !hasMore &&
                users.length === 0 &&
                searchValue.length >= ADD_FRIENDS_MIN_SEARCH_LENGTH && (
                  <Typography text={translations["noUsersFoundMatching"]} />
                )}
            </View>
          </Scroll>
        </LoadingWrapper>
      </View>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(2) },
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default AddFriend;

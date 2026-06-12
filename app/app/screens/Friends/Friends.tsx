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
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useFriendActions, useFriendsData } from "./hooks";
import { getIcon } from "@/app/utils";

export const Friends: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    searchValue,
    handleSearchChange,
    friends,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreFriends,
    forceLoadMore,
  } = useFriendsData();
  const { handleShowUserProfile } = useFriendActions();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  const styles = useStyles();

  return (
    <LayoutProvider navbar={<NavBar text={translations["friends"]} />}>
      <Input
        text={searchValue}
        onChange={handleSearchChange}
        placeholder={translations["searchFriends"]}
        beginIcon={getIcon("Search")}
        allowClear={true}
      />

      <View style={styles.mainButtons}>
        <Button
          text={translations["addFriend"]}
          onPress={() => navigation.navigate("AddFriend")}
          fullWidth={true}
        />
        <Button
          text={translations["friendRequests"]}
          onPress={() => navigation.navigate("FriendRequests")}
          fullWidth={true}
        />
      </View>

      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          keyboardPersist="never"
          centerContent={friends.length === 0}
          hasMore={hasMore}
          handleScrollEnd={loadMoreFriends}
          onManualRefresh={handleManualRefresh}
        >
          {friends.map((item, i) => {
            return (
              <ListItem
                key={`Friends/${i}`}
                text={item.user.username}
                onPress={() => handleShowUserProfile(item.user._id)}
              >
                <TouchableIcon
                  icon={getIcon("User")}
                  onPress={() => handleShowUserProfile(item.user._id)}
                />
              </ListItem>
            );
          })}

          <View style={styles.footerContainer}>
            {isLoadingMore && (
              <>
                <Loading />
                <Typography
                  text={translations["loadingMoreFriends"]}
                  variant="body-small"
                />
              </>
            )}

            {!isLoadingMore && !hasMore && friends.length > 0 && (
              <Typography
                text={translations["noMoreFriends"]}
                variant="body-small"
              />
            )}

            {!isLoadingMore && !hasMore && friends.length === 0 && (
              <Typography text={translations["noFriendsFound"]} />
            )}
          </View>
        </Scroll>
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    mainButtons: { flexDirection: "row", gap: theme.spacing(4) },
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default Friends;

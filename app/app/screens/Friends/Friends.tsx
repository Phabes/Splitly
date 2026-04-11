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
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { useFriendActions, useFriendsData } from "./hooks";

export const Friends: FC = () => {
  const { signOut } = useAuthContext();
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

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshFriendsList",
      () => {
        forceLoadMore();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [forceLoadMore]);

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
      <Input
        text={searchValue}
        onChange={handleSearchChange}
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
                  icon={faUser}
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

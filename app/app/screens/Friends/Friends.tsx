import {
  Fab,
  Input,
  ListItem,
  Loading,
  LoadingWrapper,
  NavBar,
  Scroll,
  TouchableIcon,
  Typography,
} from "@/app/components";
import { useAppNavigation, useTranslations } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useFriendActions, useFriendsData } from "./hooks";

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
    pendingRequestsCount,
  } = useFriendsData();
  const { handleShowUserProfile } = useFriendActions();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["friends"]}
          notificationsPress={() => navigation.navigate("FriendRequests")}
          notificationsExist={pendingRequestsCount > 0}
        />
      }
    >
      <Input
        text={searchValue}
        onChange={handleSearchChange}
        placeholder={translations["searchFriends"]}
        beginIcon="Search"
        allowClear={true}
      />

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
                  icon="User"
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
      <Fab onPress={() => navigation.navigate("AddFriend")} />
    </LayoutProvider>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default Friends;

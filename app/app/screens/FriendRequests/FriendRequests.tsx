import {
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
  useConfirmContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { useFriendRequests } from "./hooks";
import { formatTranslation } from "@/app/utils";

export const FriendRequests: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const { showConfirm } = useConfirmContext();

  const {
    friendRequests,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreFriendRequests,
    forceLoadMore,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleShowUserProfile,
  } = useFriendRequests();

  const styles = useStyles();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["friendRequests"]}
          onBackPress={() => {
            DeviceEventEmitter.emit("refreshFriendList");
            navigation.goBack();
          }}
        />
      }
    >
      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          keyboardPersist="never"
          centerContent={friendRequests.length === 0}
          hasMore={hasMore}
          handleScrollEnd={loadMoreFriendRequests}
          onManualRefresh={handleManualRefresh}
        >
          {friendRequests.length > 0 && (
            <Typography
              text={`${translations["friendRequests"]}:`}
              variant="header-small"
            />
          )}

          {friendRequests.map((item, i) => {
            return (
              <ListItem
                key={`FriendRequest/${i}`}
                onPress={() => handleShowUserProfile(item.requester._id)}
              >
                <View style={styles.listItemText}>
                  <Typography
                    text={item.requester.username}
                    variant="body-small"
                  />
                </View>

                <View style={styles.listItemButtons}>
                  <TouchableIcon
                    icon="Check"
                    onPress={() => handleAcceptFriendRequest(item._id)}
                  />

                  <TouchableIcon
                    icon="X"
                    onPress={() => {
                      showConfirm({
                        title: translations["rejectFriendRequest"],
                        message: formatTranslation(
                          translations["rejectFriendRequestQuestion"],
                          {
                            username: item.requester.username,
                          },
                        ),
                        isDestructive: true,
                        onConfirm: () => {
                          handleRejectFriendRequest(item._id);
                        },
                      });
                    }}
                    color="text-error"
                  />
                </View>
              </ListItem>
            );
          })}

          <View style={styles.footerContainer}>
            {isLoadingMore && (
              <>
                <Loading />
                <Typography
                  text={translations["loadingMoreFriendRequests"]}
                  variant="body-small"
                />
              </>
            )}

            {!isLoadingMore && !hasMore && friendRequests.length > 0 && (
              <Typography
                text={translations["noMoreFriendRequests"]}
                variant="body-small"
              />
            )}

            {!isLoadingMore && !hasMore && friendRequests.length === 0 && (
              <Typography text={translations["noFriendRequestsFound"]} />
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
    footerContainer: {
      alignItems: "center",
    },
    listItemText: { flex: 1 },
    listItemButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(1),
    },
  });
};

export default FriendRequests;

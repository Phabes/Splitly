import {
  Button,
  ListItem,
  Loading,
  LoadingWrapper,
  NavBar,
  Scroll,
  Typography,
} from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useFriendRequests } from "./hooks";

export const FriendRequests: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    friendRequests,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreFriendRequests,
    forceLoadMore,
  } = useFriendRequests();

  const styles = useStyles();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["friendRequests"]}
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
      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          keyboardPersist="never"
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
                text={item.requester.username}
                onPress={() => {}}
              ></ListItem>
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
    container: { flex: 1, gap: theme.spacing(2) },
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default FriendRequests;

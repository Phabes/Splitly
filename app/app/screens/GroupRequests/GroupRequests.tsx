import { FC } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
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
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { useGroupRequests } from "./hooks";

export const GroupRequests: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    groupRequests,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreGroupRequests,
    forceLoadMore,
    handleAcceptGroupRequest,
    handleRejectGroupRequest,
  } = useGroupRequests();

  const styles = useStyles();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groupRequests"]}
          onBackPress={() => {
            DeviceEventEmitter.emit("refreshGroupList");
            navigation.goBack();
          }}
        />
      }
    >
      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          keyboardPersist="never"
          centerContent={groupRequests.length === 0}
          hasMore={hasMore}
          handleScrollEnd={loadMoreGroupRequests}
          onManualRefresh={handleManualRefresh}
        >
          {groupRequests.length > 0 && (
            <Typography
              text={`${translations["groupRequests"]}:`}
              variant="header-small"
            />
          )}

          {groupRequests.map((item, i) => (
            <ListItem
              key={`GroupRequest/${i}`}
              text={`${item.name} - ${item.description}\n${translations["sentBy"]}: ${item.creator.username}`}
              onPress={() => {}}
            >
              <TouchableIcon
                icon="Check"
                onPress={() => handleAcceptGroupRequest(item._id)}
              />
              <TouchableIcon
                icon="X"
                onPress={() => handleRejectGroupRequest(item._id)}
                color="text-error"
              />
            </ListItem>
          ))}

          <View style={styles.footerContainer}>
            {isLoadingMore && (
              <>
                <Loading />
                <Typography
                  text={translations["loadingMoreGroupRequests"]}
                  variant="body-small"
                />
              </>
            )}

            {!isLoadingMore && !hasMore && groupRequests.length > 0 && (
              <Typography
                text={translations["noMoreGroupRequests"]}
                variant="body-small"
              />
            )}

            {!isLoadingMore && !hasMore && groupRequests.length === 0 && (
              <Typography text={translations["noGroupRequestsFound"]} />
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
      paddingVertical: theme.spacing(2),
    },
  });
};

export default GroupRequests;

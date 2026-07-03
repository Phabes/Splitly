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
import { useGroupsData } from "./hooks";

export const Groups: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    searchValue,
    handleSearchChange,
    groups,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreGroups,
    forceLoadMore,
    pendingRequestsCount,
  } = useGroupsData();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groups"]}
          notificationsPress={() => navigation.navigate("GroupRequests")}
          notificationsExist={pendingRequestsCount > 0}
        />
      }
    >
      <Input
        text={searchValue}
        onChange={handleSearchChange}
        placeholder={translations["searchGroups"]}
        beginIcon="Search"
        allowClear={true}
      />

      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          centerContent={groups.length === 0}
          hasMore={hasMore}
          handleScrollEnd={loadMoreGroups}
          onManualRefresh={handleManualRefresh}
        >
          {groups.map((item, i) => {
            return (
              <ListItem
                key={`Groups/${i}`}
                text={`${item.name} - ${item.description}`}
                onPress={() => navigation.navigate("GroupDetails")}
              >
                <TouchableIcon
                  icon="Users"
                  onPress={() => navigation.navigate("GroupDetails")}
                />
              </ListItem>
            );
          })}

          <View style={styles.footerContainer}>
            {isLoadingMore && (
              <>
                <Loading />
                <Typography
                  text={translations["loadingMoreGroups"]}
                  variant="body-small"
                />
              </>
            )}

            {!isLoadingMore && !hasMore && groups.length > 0 && (
              <Typography
                text={translations["noMoreGroupsFound"]}
                variant="body-small"
              />
            )}

            {!isLoadingMore && !hasMore && groups.length === 0 && (
              <Typography text={translations["noGroupsFoundMatching"]} />
            )}
          </View>
        </Scroll>
      </LoadingWrapper>
      <Fab onPress={() => navigation.navigate("CreateGroup")} />
    </LayoutProvider>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    footerContainer: {
      alignItems: "center",
    },
    content: {
      flex: 1,
      position: "relative",
    },
  });
};

export default Groups;

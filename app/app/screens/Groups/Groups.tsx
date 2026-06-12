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
import { useGroupActions, useGroupsData } from "./hooks";
import { getIcon } from "@/app/utils";

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
  } = useGroupsData();

  const { handleShowGroupProfile } = useGroupActions();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  const styles = useStyles();

  return (
    <LayoutProvider navbar={<NavBar text={translations["groups"]} />}>
      <Input
        text={searchValue}
        onChange={handleSearchChange}
        placeholder={translations["searchGroups"]}
        beginIcon={getIcon("Search")}
        allowClear={true}
      />

      <View style={styles.mainButtons}>
        <Button
          text={translations["createGroup"]}
          onPress={() => navigation.navigate("CreateGroup")}
          fullWidth={true}
        />
        <Button
          text={translations["friendRequests"]}
          onPress={() => navigation.navigate("GroupRequests")}
          fullWidth={true}
        />
      </View>

      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          keyboardPersist="never"
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
                // onPress={() => handleShowGroupProfile(item.name)}
              >
                <TouchableIcon
                  icon={getIcon("Users")}
                  onPress={() => navigation.navigate("GroupDetails")}
                  // onPress={() => handleShowGroupProfile(item.name)}
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

export default Groups;

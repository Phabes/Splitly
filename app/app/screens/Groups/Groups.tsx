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
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useGroupActions, useGroupsData } from "./hooks";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

export const Groups: FC = () => {
  const { signOut } = useAuthContext();
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
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groups"]}
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
        placeholder={translations["searchGroups"]}
        beginIcon={faSearch}
        allowClear={true}
      />
      <View style={styles.mainButtons}>
        <Button
          text={translations["addGroup"]}
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
                onPress={() => handleShowGroupProfile(item.name)}
              >
                <TouchableIcon
                  icon={faUser}
                  onPress={() => handleShowGroupProfile(item.name)}
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

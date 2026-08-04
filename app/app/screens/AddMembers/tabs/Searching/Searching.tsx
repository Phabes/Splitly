import {
  Input,
  ListItem,
  Loading,
  LoadingWrapper,
  Scroll,
  TouchableIcon,
  Typography,
} from "@/app/components";
import {
  useAddMembersContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useAddMembersData } from "./hooks";

export const Searching: FC = () => {
  const { groupID, selectedUsersData, toggleMember } = useAddMembersContext();

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    friends,
    hasMore,
    isLoadingMore,
    loadMoreUsers,
    forceLoadMore,
  } = useAddMembersData(groupID);

  const translations = useTranslations();
  const styles = useStyles();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  return (
    <View style={styles.container}>
      <Input
        text={searchQuery}
        placeholder={translations["searchFriends"]}
        onChange={setSearchQuery}
        beginIcon="Search"
        allowClear={true}
      />
      <LoadingWrapper isLoading={isSearching}>
        <Scroll
          gapSize="small"
          centerContent={friends.length === 0}
          hasMore={hasMore}
          handleScrollEnd={loadMoreUsers}
          onManualRefresh={handleManualRefresh}
        >
          {friends.length > 0 && (
            <Typography
              text={`${translations["searchedUsers"]}:`}
              variant="header-small"
            />
          )}

          {friends.map((item, i) => {
            const isSelected = selectedUsersData.some(
              (u) => u._id === item.user._id,
            );

            return (
              <ListItem
                key={`AddFriend/${i}`}
                text={item.user.username}
                onPress={() => toggleMember(item.user)}
              >
                <TouchableIcon
                  icon={isSelected ? "Minus" : "Plus"}
                  color={isSelected ? "text-error" : "text-success"}
                  onPress={() => toggleMember(item.user)}
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
            {!isLoadingMore && !hasMore && friends.length > 0 && (
              <Typography
                text={translations["noMoreUsersFound"]}
                variant="body-small"
              />
            )}
            {!isLoadingMore && !hasMore && friends.length === 0 && (
              <Typography text={translations["noUsersFoundMatching"]} />
            )}
          </View>
        </Scroll>
      </LoadingWrapper>
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(3) },
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default Searching;

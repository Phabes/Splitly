import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { faSearch, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { useAddMembersData } from "./hooks";

export const AddMembers: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<AppStackParamList, "AddMembers">>();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    route.params?.initialSelectedMembers || [],
  );

  const {
    searchQuery,
    setSearchQuery,
    friends,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreUsers,
    forceLoadMore,
  } = useAddMembersData();

  const handleManualRefresh = isLoadingMore ? undefined : forceLoadMore;

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((prevId) => prevId !== id)
        : [...prev, id],
    );
  };

  const handleConfirm = () => {
    navigation.navigate("CreateGroup", {
      selectedMembers: selectedIds,
    });
  };

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["addMembers"]}
          onBackPress={handleConfirm}
        />
      }
    >
      <View style={styles.container}>
        <Input
          text={searchQuery}
          placeholder={translations["searchFriends"] || "Search friends..."}
          onChange={setSearchQuery}
          beginIcon={faSearch}
          allowClear={true}
        />
        <LoadingWrapper isLoading={isSearching}>
          <Scroll
            gapSize="small"
            keyboardPersist="never"
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
              const isSelected = selectedIds.includes(item.user._id);

              return (
                <ListItem
                  key={`AddFriend/${i}`}
                  text={item.user.username}
                  onPress={() => toggleMember(item.user._id)}
                >
                  <TouchableIcon
                    icon={isSelected ? faMinus : faPlus}
                    onPress={() => toggleMember(item.user._id)}
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

        <View style={styles.buttons}>
          <Button
            text={`${translations["addMembers"]} (${selectedIds.length})`}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(2) },
    footerContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing(2),
    },
    buttons: {
      paddingTop: theme.spacing(2),
      gap: theme.spacing(3),
    },
  });
};

export default AddMembers;

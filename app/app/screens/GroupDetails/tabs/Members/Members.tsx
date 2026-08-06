import { Fab, FloatingMenu, Icon, ListItem, Scroll } from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useConfirmContext,
  useGroupContext,
  useLoadingContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { GroupMemberResult, MenuOption } from "@/app/types";
import { FC, useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";

export const Members: FC = () => {
  const navigation = useAppNavigation();
  const { groupDetails, userRole, setGroupMembers } = useGroupContext();
  const { showConfirm } = useConfirmContext();
  const { showLoading, hideLoading } = useLoadingContext();
  const { userData } = useAuthContext();
  const translations = useTranslations();

  const styles = useStyles();

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onMembersSelected",
      setGroupMembers,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRemoveMember = async (memberID: string) => {
    showLoading(translations["removeMember"]);
    try {
      // const response = await request(
      //   removeMemberCall,
      //   groupDetails!._id,
      //   memberID
      // );
      // if (response.ok) {
      //   const data = await response.json();
      //   // Instantly update UI with the new member list from backend
      //   setGroupMembers(data.members);
      // } else {
      //   const data = await response.json();
      //   throw new Error(data.message);
      // }
    } catch (error) {
      // Removing member failed
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const generateMenuOptions = (item: GroupMemberResult): MenuOption[] => {
    const options: MenuOption[] = [
      {
        label: translations["viewProfile"],
        onPress: () => console.log("View:", item.username),
      },
    ];

    const isMe = item._id === userData?._id;
    const targetRole = item.role;

    if (isMe) {
      options.push({
        label: translations["leaveGroup"],
        onPress: () => {
          if (userRole === "owner") {
            // TODO: Open a modal to select a new owner before API call
            console.log("Owner leaving: Must designate new owner first");
          } else {
            // TODO: Regular leave group API call
            console.log("Leaving group...");
          }
        },
      });
      return options;
    }

    if (userRole === "owner") {
      if (targetRole === "member") {
        options.push({
          label: translations["grantAdmin"],
          onPress: () => console.log("Grant Admin"),
        });
      }
      if (targetRole === "admin") {
        options.push({
          label: translations["revokeAdmin"],
          onPress: () => console.log("Revoke Admin"),
        });
      }
      if (targetRole !== "owner") {
        options.push({
          label: translations["removeMember"],
          onPress: () => {
            console.log("Remove Member");
            showConfirm({
              title: translations["removeMember"],
              message: `Are you sure you want to remove ${item.username} from the group?`,
              confirmText: translations["removeMember"],
              isDestructive: true,
              onConfirm: () => handleRemoveMember(item._id),
            });
          },
        });
      }
    }

    if (userRole === "admin") {
      if (targetRole === "member") {
        options.push({
          label: translations["grantAdmin"],
          onPress: () => console.log("Grant Admin"),
        });
        options.push({
          label: translations["removeMember"],
          onPress: () => console.log("Remove Member"),
        });
      }
    }

    return options;
  };

  return (
    <View style={styles.tabContainer}>
      <Scroll>
        <View style={styles.scrollContent}>
          <View style={styles.members}>
            {groupDetails?.members.map((item, i) => {
              return (
                <ListItem
                  key={`Member/${i}`}
                  text={item.username}
                  onPress={() => {}}
                >
                  {item.role === "owner" && (
                    <Icon
                      icon="Owner"
                      color="text-notification"
                    />
                  )}
                  {item.role === "admin" && (
                    <Icon
                      icon="Admin"
                      color="text-notification"
                    />
                  )}
                  {item.status === "pending" && (
                    <Icon
                      icon="Pending"
                      color="text-disabled"
                    />
                  )}

                  <FloatingMenu options={generateMenuOptions(item)} />
                </ListItem>
              );
            })}
          </View>
        </View>
      </Scroll>
      {(userRole === "owner" || userRole === "admin") && (
        <Fab
          onPress={() =>
            navigation.navigate("AddMembers", {
              groupID: groupDetails!._id,
              returnEvent: "onMembersSelected",
            })
          }
        />
      )}
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    tabContainer: { flex: 1 },
    scrollContent: {
      flex: 1,
      gap: theme.spacing(3),
      paddingHorizontal: theme.spacing(3),
    },
    members: {
      gap: theme.spacing(2),
    },
  });
};

export default Members;

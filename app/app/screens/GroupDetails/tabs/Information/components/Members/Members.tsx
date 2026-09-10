import {
  Fab,
  FloatingMenu,
  Icon,
  ListItem,
  Scroll,
  Typography,
} from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useConfirmContext,
  useGroupContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { GroupMemberResult, MenuOption } from "@/app/types";
import { formatTranslation } from "@/app/utils";
import { FC, useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import {
  useRemoveMember,
  useTransferOwnership,
  useUpdateMemberRole,
} from "./hooks";

export const Members: FC = () => {
  const navigation = useAppNavigation();
  const { groupDetails, userRole, setGroupMembers } = useGroupContext();
  const { showConfirm } = useConfirmContext();
  const { userData } = useAuthContext();
  const translations = useTranslations();
  const { handleRemoveMember } = useRemoveMember();
  const { handleTransferOwnership } = useTransferOwnership();
  const { handleUpdateMemberRole } = useUpdateMemberRole();

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

  const generateMenuOptions = (item: GroupMemberResult): MenuOption[] => {
    const options: MenuOption[] = [
      {
        label: translations["viewProfile"],
        onPress: () => console.log("View:", item.username),
      },
    ];

    const targetRole = item.role;

    if (userRole === "owner") {
      if (targetRole === "member") {
        options.push({
          label: translations["grantAdmin"],
          onPress: () => handleUpdateMemberRole(item._id, "admin"),
        });
      }
      if (targetRole === "admin") {
        options.push({
          label: translations["revokeAdmin"],
          onPress: () => handleUpdateMemberRole(item._id, "member"),
        });
      }
      if (targetRole !== "owner") {
        options.push({
          label: translations["makeOwner"],
          onPress: () => {
            showConfirm({
              title: translations["makeOwner"],
              message: formatTranslation(translations["changeOwnerQuestion"], {
                username: item.username,
              }),
              isDestructive: true,
              onConfirm: () => handleTransferOwnership(item._id),
            });
          },
        });
        options.push({
          label: translations["removeMember"],
          onPress: () => {
            showConfirm({
              title: translations["removeMember"],
              message: formatTranslation(translations["removeMemberQuestion"], {
                username: item.username,
              }),
              isDestructive: true,
              onConfirm: () => handleRemoveMember(item._id, false),
            });
          },
        });
      }
    } else if (userRole === "admin") {
      if (targetRole === "member") {
        options.push({
          label: translations["grantAdmin"],
          onPress: () => handleUpdateMemberRole(item._id, "admin"),
        });
        options.push({
          label: translations["removeMember"],
          onPress: () => {
            showConfirm({
              title: translations["removeMember"],
              message: formatTranslation(translations["removeMemberQuestion"], {
                username: item.username,
              }),
              isDestructive: true,
              onConfirm: () => handleRemoveMember(item._id, false),
            });
          },
        });
      }
    }

    const isMe = item._id === userData?._id;

    if (isMe) {
      options.push({
        label: translations["leaveGroup"],
        onPress: () => {
          showConfirm({
            title: translations["leaveGroup"],
            message: formatTranslation(translations["leaveGroupQuestion"], {
              groupName: groupDetails!.name,
            }),
            isDestructive: true,
            onConfirm: () => handleRemoveMember(item._id, true),
          });
        },
      });
      return options;
    }

    return options;
  };

  return (
    <View style={styles.tabContainer}>
      <Typography
        text="Members"
        variant="header-small"
      />

      <Scroll>
        <View style={styles.scrollContent}>
          <View style={styles.members}>
            {groupDetails?.members.map((item, i) => {
              return (
                <ListItem
                  key={`Member/${i}`}
                  onPress={() => {}}
                >
                  <View style={styles.listItemText}>
                    <Typography
                      text={item.username}
                      variant="body-small"
                    />
                  </View>

                  <View style={styles.listItemIcons}>
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
                  </View>
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
    tabContainer: { flex: 1, gap: theme.spacing(2) },
    scrollContent: {
      flex: 1,
      gap: theme.spacing(3),
    },
    members: {
      gap: theme.spacing(2),
    },
    listItemText: { flex: 1 },
    listItemIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(1),
    },
  });
};

export default Members;

import { Fab, FloatingMenu, Icon, ListItem, Scroll } from "@/app/components";
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
import { useRemoveMember } from "./hooks";

export const Members: FC = () => {
  const navigation = useAppNavigation();
  const { groupDetails, userRole, setGroupMembers } = useGroupContext();
  const { showConfirm } = useConfirmContext();
  const { userData } = useAuthContext();
  const translations = useTranslations();
  const { handleRemoveMember } = useRemoveMember();

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
            showConfirm({
              title: translations["leaveGroup"],
              message: formatTranslation(translations["leaveGroupQuestion"], {
                groupName: groupDetails!.name,
              }),
              isDestructive: true,
              onConfirm: () => handleRemoveMember(item._id),
            });
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
            showConfirm({
              title: translations["removeMember"],
              message: formatTranslation(translations["removeMemberQuestion"], {
                username: item.username,
              }),
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
          onPress: () => {
            showConfirm({
              title: translations["removeMember"],
              message: formatTranslation(translations["removeMemberQuestion"], {
                username: item.username,
              }),
              isDestructive: true,
              onConfirm: () => handleRemoveMember(item._id),
            });
          },
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

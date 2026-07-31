import { Fab, Icon, ListItem, Scroll, TouchableIcon } from "@/app/components";
import {
  useAppNavigation,
  useGroupContext,
  useThemeContext,
} from "@/app/hooks";
import { FC, useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";

export const Members: FC = () => {
  const navigation = useAppNavigation();
  const { groupDetails, userRole } = useGroupContext();

  const styles = useStyles();

  const refreshMembers = () => {
    console.log("REFRESH MEMBERS");
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onMembersSelected",
      refreshMembers,
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
                  <TouchableIcon
                    icon="EllipsisVertical"
                    color="text-secondary"
                    onPress={() => {
                      console.log("MEMBER MENU");
                    }}
                  />
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

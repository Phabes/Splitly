import { Fab, ListItem, Scroll } from "@/app/components";
import {
  useAppNavigation,
  useGroupContext,
  useThemeContext,
} from "@/app/hooks";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

export const Members: FC = () => {
  const { groupDetails, isAdmin } = useGroupContext();
  const navigation = useAppNavigation();

  const styles = useStyles();

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
                />
              );
            })}
            {groupDetails?.members.map((item, i) => {
              return (
                <ListItem
                  key={`Member/${i}`}
                  text={item.username}
                  onPress={() => {}}
                />
              );
            })}
            {groupDetails?.members.map((item, i) => {
              return (
                <ListItem
                  key={`Member/${i}`}
                  text={item.username}
                  onPress={() => {}}
                />
              );
            })}
          </View>
        </View>
      </Scroll>
      {isAdmin && (
        <Fab
          onPress={() =>
            navigation.navigate("AppendMembers", { groupID: groupDetails!._id })
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

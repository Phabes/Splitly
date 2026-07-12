import { Button, ListItem, Scroll } from "@/app/components";
import { useGroupContext, useThemeContext } from "@/app/hooks";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

export const Members: FC = () => {
  const styles = useStyles();
  const { groupDetails } = useGroupContext();

  return (
    <Scroll>
      <View style={styles.scrollContent}>
        {groupDetails?.members.map((item, i) => {
          return (
            <ListItem
              text={item.username}
              onPress={() => {}}
            />
          );
        })}

        <Button
          text="Add more members"
          variant="secondary"
          onPress={() => {}}
        />
      </View>
    </Scroll>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    scrollContent: {
      flex: 1,
      gap: theme.spacing(1),
      padding: theme.spacing(2),
    },
  });
};

export default Members;

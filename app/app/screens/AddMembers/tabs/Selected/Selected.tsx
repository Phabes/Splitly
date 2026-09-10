import { ListItem, Scroll, TouchableIcon, Typography } from "@/app/components";
import {
  useAddMembersContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

export const Selected: FC = () => {
  const { selectedUsersData, toggleMember } = useAddMembersContext();
  const translations = useTranslations();

  const styles = useStyles();

  return (
    <Scroll
      gapSize="small"
      centerContent={selectedUsersData.length === 0}
    >
      {selectedUsersData.length === 0 ? (
        <View style={styles.footerContainer}>
          <Typography text={translations["noMembersSelectedYet"]} />
        </View>
      ) : (
        selectedUsersData.map((item, i) => (
          <ListItem
            key={`Selected/${i}`}
            onPress={() => {}}
          >
            <View style={styles.listItemText}>
              <Typography
                text={item.username}
                variant="body-small"
              />
            </View>

            <View style={styles.listItemButtons}>
              <TouchableIcon
                icon="Minus"
                color="text-error"
                onPress={() => toggleMember(item)}
              />
            </View>
          </ListItem>
        ))
      )}
    </Scroll>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    footerContainer: {
      alignItems: "center",
    },
    listItemText: { flex: 1 },
    listItemButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(1),
    },
  });
};

export default Selected;

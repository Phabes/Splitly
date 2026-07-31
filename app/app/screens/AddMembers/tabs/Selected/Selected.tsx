import { ListItem, Scroll, TouchableIcon, Typography } from "@/app/components";
import { useAddMembersContext, useTranslations } from "@/app/hooks";
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
            text={item.username}
            onPress={() => {}}
          >
            <TouchableIcon
              icon="Minus"
              color="text-error"
              onPress={() => toggleMember(item)}
            />
          </ListItem>
        ))
      )}
    </Scroll>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default Selected;

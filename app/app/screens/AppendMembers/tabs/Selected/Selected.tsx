import { ListItem, Scroll, TouchableIcon, Typography } from "@/app/components";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useAppendMembersContext, useTranslations } from "@/app/hooks";

export const Selected: FC = () => {
  const { selectedUsersData, toggleMember } = useAppendMembersContext();
  const translations = useTranslations();

  const styles = useStyles();

  return (
    <Scroll
      gapSize="small"
      centerContent={selectedUsersData.length === 0}
    >
      {selectedUsersData.length === 0 ? (
        <View
          style={[
            styles.footerContainer,
            { flex: 1, justifyContent: "center" },
          ]}
        >
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
      // justifyContent: "center",
    },
  });
};

export default Selected;

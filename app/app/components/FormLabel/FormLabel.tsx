import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";

type FormLabelProps = {
  text: string;
  message?: string;
};

export const FormLabel: FC<FormLabelProps> = ({ text, message }) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.labelText}>
        <Typography
          text={text}
          variant="body-small"
        />
      </View>
      <View>
        {message && (
          <Typography
            text={message}
            variant="body-small"
            color="text-error"
          />
        )}
      </View>
    </View>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    labelText: {
      flex: 1,
    },
  });
};

export default FormLabel;

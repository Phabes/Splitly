import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { FormLabel } from "../FormLabel";
import { useTheme } from "@/app/hooks";

type FormDataProps = PropsWithChildren<{
  labelText: string;
  messageText?: string;
}>;

export const FormData: FC<FormDataProps> = ({
  labelText,
  messageText,
  children,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <FormLabel
        text={labelText}
        message={messageText}
      />
      {children}
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      gap: theme.spacing(1),
    },
  });
};

export default FormData;

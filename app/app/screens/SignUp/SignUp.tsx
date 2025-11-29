import { Button, Typography } from "@/app/components";
import { useTheme } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { FC } from "react";
import { View } from "react-native";

export const SignUp: FC = () => {
  const navigation = useAuthNavigation();
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors["background-app"],
      }}
    >
      <Typography text={"Sign Up"} />
      <Typography
        text={"Sign Up"}
        color="text-secondary"
      />
      <Typography
        text={"Sign Up"}
        color="text-disabled"
      />
      <Typography
        text={"Sign Up"}
        color="text-error"
      />
      <Typography
        text={"Sign Up"}
        color="text-success"
      />
      <Button
        text={"Sign In"}
        onPress={() => navigation.replace("SignIn")}
      />
    </View>
  );
};

export default SignUp;

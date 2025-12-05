import { Button, Input, Typography } from "@/app/components";
import { useTheme } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { FC } from "react";
import { View } from "react-native";

export const SignIn: FC = () => {
  const navigation = useAuthNavigation();
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors["background-app"],
      }}
    >
      <Typography text={"Sign In"} />
      <Typography
        text={"Sign In"}
        color="text-secondary"
      />
      <Typography
        text={"Sign In"}
        color="text-disabled"
      />
      <Typography
        text={"Sign In"}
        color="text-error"
      />
      <Typography
        text={"Sign In"}
        color="text-success"
      />
      <Input
        text={"asca"}
        onChange={function (value: string): void {}}
      />
      <Button
        text={"Sign Up"}
        onPress={() => navigation.replace("SignUp")}
      />
    </View>
  );
};

export default SignIn;

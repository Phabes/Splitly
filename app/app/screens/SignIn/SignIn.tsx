import { Button } from "@/app/components";
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
      <Button
        text={"Sign In"}
        onPress={() => {}}
      />
      <Button
        text={"Sign Up"}
        variant="secondary"
        onPress={() => navigation.replace("SignUp")}
      />
    </View>
  );
};
export default SignIn;
